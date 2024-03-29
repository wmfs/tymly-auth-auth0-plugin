const axios = require('axios')
const Boom = require('@hapi/boom')

const EMAIL_FROM_USER_ID_CACHE_NAME = 'emailFromUserId'
const ROLES_FROM_USER_ID_CACHE_NAME = 'rolesFromUserId'
const USER_ID_FROM_EMAIL_CACHE_NAME = 'userIdFromEmail'
const THIRTY_MINUTES_IN_MILLISECONDS = 1800000

class Auth0Service {
  boot (options) {
    this.logger = options.bootedServices.logger.child('service:userInfo')
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
    this.cacheService.defaultIfNotInConfig(ROLES_FROM_USER_ID_CACHE_NAME, cacheOptions)

    // TODO: set process.env.PROXY_URL

    this.auth0GroupMappingService = options.bootedServices.auth0GroupMapping
    this.timestampService = options.bootedServices.timestamp

    this.accessToken = null
    this.accessExpires = this.timestampService.now()
  }

  /**
   * Search Auth0 users
   * @param {string} query search term
   * @param {integer} offset of the results
   * @param {integer} limit number of results
   * @returns {undefined}
   */
  async searchUsers ({ query, offset = 0, limit = 10 }) {
    if (query) {
      const url = this.auth0GetUsersByIdUrlPrefix
      const request = {
        params: {
          q: `name:*${query}*`,
          sort: 'created_at:1',
          page: offset,
          per_page: limit,
          include_totals: true,
          search_engine: 'v3'
        }
      }

      return this._get(url, request)
    } else {
      this.logger.warn('Error searching users: No query provided')
    }
  }

  /**
   * Gets all user data from auth0 by provided user id
   * @param userId
   * @returns {undefined}
   */
  async allFromUserId (userId) {
    const url = `${this.auth0GetUsersByIdUrlPrefix}/${userId}`
    return this._get(url)
  }

  /**
   * Converts a provider user id into an email address, via an auth0 web api
   * @param {string} userId a provider use id
   * @param callback callback function, whose first parameter holds error details or {undefined}, and whose second parameter holds the email address returned by the auth0 web api
   * @returns {undefined}
   */
  async emailFromUserId (userId) {
    return this._fieldFromUserId(userId, 'email', this.emailFromUserIdCache)
  } // emailFromUserId

  async rolesFromUserId (userId) {
    return this._fieldFromUserId(userId, 'groups', this.rolesFromUserIdCache)
  } // rolesFromUserId

  async _fieldFromUserId (userId, field, cache) {
    const val = cache.bind(this)(userId)
    if (val) {
      return val
    }

    const url = `${this.auth0GetUsersByIdUrlPrefix}/${userId}`
    const body = await this._get(url)

    await this._addToCache(userId, body.email || body.userPrincipalName, body.groups)
    return cache.bind(this)(userId)
  } // _fieldFromUserId

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
      params: {
        email,
        search_engine: 'v3'
      }
    }

    const body = await this._get(url, request)

    if (body && body.length) {
      return this._processUserInfo(body)
    }

    Boom.notFound(`No user details found in response from ${url}`)
  } // userIdFromEmail

  async _processUserInfo (body) {
    const userInfo = this._findUserInfo(body)

    await this._addToCache(userInfo.user_id, userInfo.email, userInfo.groups)
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

    // Nothing matched or auth0Connection not set
    return body[0]
  } // _findUserInfo

  // //////////////////
  // internal
  userIdFromEmailCache (email) { return this.cacheService.get(USER_ID_FROM_EMAIL_CACHE_NAME, email) }
  emailFromUserIdCache (userId) { return this.cacheService.get(EMAIL_FROM_USER_ID_CACHE_NAME, userId) }
  rolesFromUserIdCache (userId) { return this.cacheService.get(ROLES_FROM_USER_ID_CACHE_NAME, userId) }

  async _addToCache (userId, email, groups = []) {
    const roles = this._groupsToRoles(groups)

    this.cacheService.set(USER_ID_FROM_EMAIL_CACHE_NAME, email, userId)
    this.cacheService.set(EMAIL_FROM_USER_ID_CACHE_NAME, userId, email)
    this.cacheService.set(ROLES_FROM_USER_ID_CACHE_NAME, userId, roles)
  } // _addToCache

  _groupsToRoles (groups) {
    return this.auth0GroupMappingService.groupsToRoles(groups)
  } // _groupsToRoles

  async _get (url, options = {}, auth = true) {
    const request = await this._buildRequest(url, options, auth)

    try {
      const { data, status, statusText } = await axios(request)

      if (status === 200) return data

      fail(`Invalid response from ${url}`, `${status} - ${statusText}`)
    } catch (err) {
      fail(`Error getting ${url}`, err.message)
    }
  } // _get

  async _buildRequest (url, options = {}, auth) {
    const defaultOptions = {
      method: 'GET',
      url,
      headers: { 'content-type': 'application/json' },
      timeout: this.webAPITimeoutInMilliseconds
    }

    if (auth) {
      const jwt = await this._managementAPIAccessToken()
      defaultOptions.headers.authorization = `Bearer ${jwt}`
    }

    return Object.assign(defaultOptions, options)
  } // _buildRequest

  async _managementAPIAccessToken () {
    const now = this.timestampService.now()
    if (now.isBefore(this.accessExpires)) {
      return this.accessToken
    }

    if (!this.auth0Audience) {
      throw Boom.unauthorized('auth0 domain has not been configured (the TYMLY_NIC_AUTH0_DOMAIN environment variable is not set)')
    } else if (!this.auth0ClientId) {
      throw Boom.unauthorized('auth0 client id has not been configured (the TYMLY_NIC_AUTH0_CLIENT_ID environment variable is not set)')
    } else if (!this.auth0ClientSecret) {
      throw Boom.unauthorized('auth0 client secret has not been configured (the TYMLY_NIC_AUTH0_CLIENT_SECRET environment variable is not set)')
    }

    const url = this.auth0GetManagementAPIAccessTokenUrl
    const options = {
      method: 'POST',
      data: {
        grant_type: 'client_credentials',
        client_id: this.auth0ClientId,
        client_secret: this.auth0ClientSecret,
        audience: this.auth0Audience
      }
    }

    const body = await this._get(url, options, false)

    this.accessToken = body.access_token
    this.accessExpires = now.add(
      (body.expires_in - 60), // wind back to make sure we refresh in good time
      'seconds'
    )
    return this.accessToken
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
  bootBefore: ['rbac'],
  bootAfter: ['caches', 'timestamp', 'auth0GroupMapping']
}
