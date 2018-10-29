'use strict'

const request = require('request')
const Boom = require('boom')
const debug = require('debug')('@wmfs/tymly-auth-plugin')

const EMAIL_FROM_USER_ID_CACHE_NAME = 'emailFromUserId'
const GROUPS_FROM_USER_ID_CACHE_NAME = 'groupsFromUserId'
const USER_ID_FROM_EMAIL_CACHE_NAME = 'userIdFromEmail'
const THIRTY_MINUTES_IN_MILLISECONDS = 1800000

class Auth0Service {
  boot (options, callback) {
    options.messages.info('Auth0 User Information')

    if (process.env.TYMLY_NIC_AUTH0_DOMAIN) {
      this.auth0GetManagementAPIAccessTokenUrl = `https://${process.env.TYMLY_NIC_AUTH0_DOMAIN}/oauth/token`
      this.auth0Audience = `https://${process.env.TYMLY_NIC_AUTH0_DOMAIN}/api/v2/`
      this.auth0GetUsersByIdUrlPrefix = `${this.auth0Audience}users`
      this.auth0GetUsersByEmailUrl = `${this.auth0Audience}users-by-email`
    }

    if (process.env.TYMLY_NIC_AUTH0_CLIENT_ID) {
      this.auth0ClientId = process.env.TYMLY_NIC_AUTH0_CLIENT_ID
    }

    if (process.env.TYMLY_NIC_AUTH0_CLIENT_SECRET) {
      this.auth0ClientSecret = process.env.TYMLY_NIC_AUTH0_CLIENT_SECRET
    }

    this.auth0Connection = process.env.TYMLY_NIC_AUTH0_CONNECTION

    this.webAPITimeoutInMilliseconds = (process.env.WEB_API_TIMEOUT_IN_MS || 3000)

    const cacheOptions = {
      max: (process.env.TYMLY_USER_CACHE_SIZE || 500),
      maxAge: (process.env.TYMLY_USER_CACHE_MAX_AGE_IN_MS || THIRTY_MINUTES_IN_MILLISECONDS)
    }

    this.cacheService = options.bootedServices.caches
    this.cacheService.defaultIfNotInConfig(USER_ID_FROM_EMAIL_CACHE_NAME, cacheOptions)
    this.cacheService.defaultIfNotInConfig(EMAIL_FROM_USER_ID_CACHE_NAME, cacheOptions)
    this.cacheService.defaultIfNotInConfig(GROUPS_FROM_USER_ID_CACHE_NAME, cacheOptions)

    if (process.env.PROXY_URL) {
      this.request = request.defaults({ 'proxy': process.env.PROXY_URL })
    } else {
      this.request = request.defaults()
    }

    callback(null)
  }

  /**
   * Converts a provider user id into an email address, via an auth0 web api
   * @param {string} userId a provider use id
   * @param callback callback function, whose first parameter holds error details or {undefined}, and whose second parameter holds the email address returned by the auth0 web api
   * @returns {undefined}
   */
  async emailFromUserId (userId) {
    const email = this.emailFromUserIdCache(userId)
    if (email) {
      return email
    }

    const url = `${this.auth0GetUsersByIdUrlPrefix}/${userId}`
    const body = await this._get(url)

    if (body.email) {
      this._addToCache(userId, body.email)
      return body.email
    }

    fail(`No email found in response from ${url}`)
  } // emailFromUserId

  /**
   * Converts an email address into a provider user id, via an auth0 web api
   * @param {string} email a users email address
   * @param callback callback function, whose first parameter holds error details or {undefined}, and whose second parameter holds the user id returned by the auth0 web api
   * @returns {undefined}
   */
  async userIdFromEmail (email) {
    const userId = this.userIdFromEmailCache(email)
    if (userId) {
      return userId
    }

    const url = this.auth0GetUsersByEmailUrl
    const request = {
      qs: {
        email: email
      }
    }

    const body = await this._get(url, request)

    if (body && body.length) {
      return this._processUserInfo(body)
    }

    Boom.notFound(new Error(`No user details found in response from ${url}`))
  } // userIdFromEmail

  _processUserInfo (body) {
    const userInfo = this._findUserInfo(body)

    this._addToCache(userInfo.user_id, userInfo.email)
    return userInfo.user_id
  } // _processUserInfo

  _findUserInfo (body) {
    for (const candidate of body) {
      for (const identity of candidate.identities) {
        if (identity.connection === this.auth0Connection) {
          return candidate
        }
      }
    }

    // Nothin matched or auth0Connection not set
    return body[0]
  } // _findUserInfo

  async groupsFromUserId (userId) {
    const groups = this.groupsFromUserIdCache(userId)
    if (groups) {
      return groups
    }

    const url = `${this.auth0GetUsersByIdUrlPrefix}/${userId}`
    const body = await this._get(url)

    const g = body.groups || []
    this._addToCache(userId, null, g)
    return g
  } // groupsFromUserId

  // //////////////////
  // internal
  userIdFromEmailCache (email) { return this.cacheService.get(USER_ID_FROM_EMAIL_CACHE_NAME, email) }
  emailFromUserIdCache (userId) { return this.cacheService.get(EMAIL_FROM_USER_ID_CACHE_NAME, userId) }
  groupsFromUserIdCache (userId) { return this.cacheService.get(GROUPS_FROM_USER_ID_CACHE_NAME, userId) }

  _addToCache (userId, email, groups) {
    this.cacheService.set(USER_ID_FROM_EMAIL_CACHE_NAME, email, userId)
    this.cacheService.set(EMAIL_FROM_USER_ID_CACHE_NAME, userId, email)
    this.cacheService.set(GROUPS_FROM_USER_ID_CACHE_NAME, userId, groups)
  } // _addToCache

  _makeRequest (options) {
    return new Promise((resolve, reject) => {
      this.request(
        options,
        (err, response, body) => {
          if (err) return reject(err)
          resolve([response, body])
        }
      )
    })
  } // _makeRequest

  async _get (url, options = {}) {
    const request = await this._buildRequest(url, options)
    const [response, body] = await this._fetch(request)

    // are we good?
    if (response.statusCode === 200) return body

    // oh dear
    if (body.statusCode && body.error && body.message && body.errorCode) {
      fail(body.message, {
        statusCode: body.statusCode,
        message: body.error
      })
    }

    fail(`Invalid response from ${url}`, response)
  } // _get

  async _buildRequest (url, options = {}) {
    const jwt = await this._managementAPIAccessToken()

    const getRequest = {
      method: 'GET',
      url: url,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${jwt.access_token}`
      },
      json: true,
      timeout: this.webAPITimeoutInMilliseconds
    }

    const request = Object.assign(getRequest, options)
    return request
  } // _buildRequest

  _fetch (options) {
    return new Promise((resolve, reject) => {
      this.request(
        options,
        (err, response, body) => {
          if (err) return reject(err)
          resolve([response, body])
        }
      )
    })
  } // _fetch

  async _managementAPIAccessToken () {
    if (!this.auth0Audience) {
      throw Boom.unauthorized('auth0 domain has not been configured (the TYMLY_NIC_AUTH0_DOMAIN environment variable is not set)')
    } else if (!this.auth0ClientId) {
      throw Boom.unauthorized('auth0 client id has not been configured (the TYMLY_NIC_AUTH0_CLIENT_ID environment variable is not set)')
    } else if (!this.auth0ClientSecret) {
      throw Boom.unauthorized('auth0 client secret has not been configured (the TYMLY_NIC_AUTH0_CLIENT_SECRET environment variable is not set)')
    }

    const [response, body] = await this._makeRequest({
      method: 'POST',
      url: this.auth0GetManagementAPIAccessTokenUrl,
      headers: {
        'content-type': 'application/json'
      },
      body: {
        grant_type: 'client_credentials',
        client_id: this.auth0ClientId,
        client_secret: this.auth0ClientSecret,
        audience: this.auth0Audience
      },
      json: true,
      timeout: this.webAPITimeoutInMilliseconds
    })
    if (body.access_token && body.token_type && body.token_type === 'Bearer') {
      return body
    }

    if (body.statusCode && body.error && body.message && body.errorCode) {
      throw body
    }

    if (body) {
      throw Boom.boomify(new Error(`Invalid response from ${this.auth0GetManagementAPIAccessTokenUrl}`), {
        message: JSON.stringify(body)
      })
    }

    debug(`auth0 response status code from ${this.auth0GetManagementAPIAccessTokenUrl}:`, response && response.statusCode)
    throw Boom.boomify(new Error('No response from auth0'))
  } // _managementAPIAccessToken
} // class Auth0Service

function fail (message, extras = {}) {
  throw Boom.boomify(
    new Error(message),
    extras
  )
} // fail

module.exports = {
  serviceClass: Auth0Service,
  bootBefore: ['tymly', 'rbac'],
  bootAfter: ['caches']
}
