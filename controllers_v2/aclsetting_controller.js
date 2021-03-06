// encode `/` to `-`
function encodeSlaToHyp(text) {
  if (!text) {
    return null
  } else if (typeof text === 'string' && text.constructor == String) {
    // console.log('string')
    text = text.replace(/\//g, '-')
    return text
  } else if (typeof text === 'object' && text.constructor == Array) {
    // console.log('array')
    for (let i = 0; i < text.length; i++) text[i] = text[i].replace(/\//g, '-')
    return text
  } else {
    return text
  }
}
// decode `-` to `/`
function decodeHypToSla(text) {
  if (!text) {
    return null
  } else if (typeof text === 'string' && text.constructor == String) {
    // console.log('string')
    text = text.replace(/\-/g, '/')
    return text
  } else if (typeof text === 'object' && text.constructor == Array) {
    // console.log('array')
    for (let i = 0; i < text.length; i++) text[i] = text[i].replace(/\-/g, '/')
    return text
  } else {
    return text
  }
}

// Adds roles to a given user id.
exports.addUserRoles = function (acl) {
  return function (req, res, next) {
    var userId = req.body.userId
    var roles = req.body.roles

    if (userId && roles) {
      acl.addUserRoles(userId, roles, function (err) {
        if (err) {
          return res.status(500).send(err.errmsg)
        }
        req.type = 1
        next()
        // res.json({results: {status: 1, msg: 'success'}})
      })
    } else {
      return res.status(400).send('empty inputs')
    }
  }
}

// Remove roles from a given user.
exports.removeUserRoles = function (acl) {
  return function (req, res, next) {
    var userId = req.body.userId
    var roles = req.body.roles

    if (userId && roles) {
      acl.removeUserRoles(userId, roles, function (err) {
        if (err) {
          return res.status(500).send(err.errmsg)
        }
        req.type = 2
        next()
        // res.json({results: {status: 1, msg: 'success'}})
      })
    } else {
      return res.status(400).send('empty inputs')
    }
  }
}

// Return all the roles from a given user.
exports.userRoles = function (acl) {
  return function (req, res) {
    var userId = req.query.userId

    if (userId) {
      acl.userRoles(userId, function (err, roles) {
        if (err) {
          return res.status(500).send(err.errmsg)
        }
        res.json({results: {status: 1, msg: 'success', roles: roles}})
      })
    } else {
      return res.status(400).send('empty inputs')
    }
  }
}

// Return all users who has a given role.
exports.roleUsers = function (acl) {
  return function (req, res) {
    var rolename = req.query.rolename

    if (rolename) {
      acl.roleUsers(rolename, function (err, users) {
        if (err) {
          return res.status(500).send(err.errmsg)
        }
        res.json({results: {status: 1, msg: 'success', users: users}})
      })
    } else {
      return res.status(400).send('empty inputs')
    }
  }
}

// Return boolean whether user has the role
exports.hasRole = function (acl) {
  return function (req, res) {
    var userId = req.query.userId
    var rolename = req.query.rolename

    if (userId && rolename) {
      acl.hasRole(userId, rolename, function (err, hasRole) {
        if (err) {
          return res.status(500).send(err.errmsg)
        }
        res.json({results: {status: 1, msg: 'success', hasRole: hasRole}})
      })
    } else {
      return res.status(400).send('empty inputs')
    }
  }
}

// Adds a parent or parent list to role.
exports.addRoleParents = function (acl) {
  return function (req, res) {
    var role = req.body.role
    var parents = req.body.parents

    if (role && parents) {
      acl.addRoleParents(role, parents, function (err) {
        if (err) {
          return res.status(500).send(err.errmsg)
        }
        res.json({results: {status: 1, msg: 'success'}})
      })
    } else {
      return res.status(400).send('empty inputs')
    }
  }
}

// Removes a parent or parent list from role.
exports.removeRoleParents = function (acl) {
  return function (req, res) {
    var role = req.body.role
    var parents = req.body.parents

    if (role && parents) {
      acl.removeRoleParents(role, parents, function (err) {
        if (err) {
          return res.status(500).send(err.errmsg)
        }
        res.json({results: {status: 1, msg: 'success'}})
      })
    } else {
      return res.status(400).send('empty inputs')
    }
  }
}

// Removes a role from the system.
exports.removeRole = function (acl) {
  return function (req, res) {
    var role = req.body.role

    if (role) {
      acl.removeRole(role, function (err) {
        if (err) {
          return res.status(500).send(err.errmsg)
        }
        res.json({results: {status: 1, msg: 'success'}})
      })
    } else {
      return res.status(400).send('empty inputs')
    }
  }
}

// Removes a resource from the system
exports.removeResource = function (acl) {
  return function (req, res) {
    // var resource = req.body.resource
    var resource = encodeSlaToHyp(req.body.resource)

    if (resource) {
      acl.removeResource(resource, function (err) {
        if (err) {
          return res.status(500).send(err.errmsg)
        }
        res.json({results: {status: 1, msg: 'success'}})
      })
    } else {
      return res.status(400).send('empty inputs')
    }
  }
}

// Adds the given permissions to the given roles over the given resources.
exports.allow = function (acl) {
  return function (req, res) {
    var roles = req.body.roles
    // var resources = req.body.resources
    var resources = encodeSlaToHyp(req.body.resources)
    var permissions = req.body.permissions
    if (roles && resources && permissions) {
      acl.allow(roles, resources, permissions, function (err) {
        if (err) {
          return res.status(500).send(err.errmsg)
        }
        res.json({results: {status: 1, msg: 'success'}})
      })
    } else {
      return res.status(400).send('empty inputs')
    }
  }
}

// Remove permissions from the given roles owned by the given role.
exports.removeAllow = function (acl) {
  return function (req, res) {
    var roles = req.body.roles
    // var resources = req.body.resources
    var resources = encodeSlaToHyp(req.body.resources)
    var permissions = req.body.permissions

    if (roles && resources && permissions) {
      acl.removeAllow(roles, resources, permissions, function (err) {
        if (err) {
          return res.status(500).send(err.errmsg)
        }
        res.json({results: {status: 1, msg: 'success'}})
      })
    } else {
      return res.status(400).send('empty inputs')
    }
  }
}

// Returns all the allowable permissions a given user have to access the given resources.
exports.allowedPermissions = function (acl) {
  return function (req, res) {
    var userId = req.query.userId
    // var resources = req.query.resources
    var resources = encodeSlaToHyp(req.query.resources)

    if (userId && resources) {
      acl.allowedPermissions(userId, resources, function (err, permissions) {
        if (err) {
          return res.status(500).send(err.errmsg)
        }
        res.json({results: {status: 1, msg: 'success', permissions: permissions}})
      })
    } else {
      return res.status(400).send('empty inputs')
    }
  }
}

// Checks if the given user is allowed to access the resource for the given permissions (note: it must fulfill all the permissions).
exports.isAllowed = function (acl) {
  return function (req, res) {
    var userId = req.query.userId
    // var resources = req.query.resources
    var resources = encodeSlaToHyp(req.query.resources)
    var permissions = req.query.permissions

    if (userId && resources && permissions) {
      acl.isAllowed(userId, resources, permissions, function (err, allowed) {
        if (err) {
          return res.status(500).send(err.errmsg)
        }
        res.json({results: {status: 1, msg: 'success', allowed: allowed}})
      })
    } else {
      return res.status(400).send('empty inputs')
    }
  }
}

// Returns true if any of the given roles have the right permissions.
exports.areAnyRolesAllowed = function (acl) {
  return function (req, res) {
    var roles = req.query.roles
    // var resources = req.query.resources
    var resources = encodeSlaToHyp(req.query.resources)
    var permissions = req.query.permissions

    if (roles && resources && permissions) {
      acl.areAnyRolesAllowed(roles, resources, permissions, function (err, allowed) {
        if (err) {
          return res.status(500).send(err.errmsg)
        }
        res.json({results: {status: 1, msg: 'success', allowed: allowed}})
      })
    } else {
      return res.status(400).send('empty inputs')
    }
  }
}

exports.whatResources = function (acl) {
  return function (req, res) {
    var roles = req.query.roles
    var permissions = req.query.permissions

    if (roles && permissions) {
// Returns what resources a role has the given permissions over.
      acl.whatResources(roles, permissions, function (err, resources) {
        if (err) {
          return res.status(500).send(err.errmsg)
        }
        // res.json({results: {status: 1, msg: 'success', resources: resources}})
        res.json({results: {status: 1, msg: 'success', resources: decodeHypToSla(resources)}})
      })
    } else if (roles) {
// Returns what resources a given role has permissions over.
      acl.whatResources(roles, function (err, resPerm) {
        if (err) {
          return res.status(500).send(err.errmsg)
        }
        // decode key of resPerm
        for (let key in resPerm) {
          if (key.indexOf('-') === -1) {
            continue
          } else {
            let decoded_key = decodeHypToSla(key)
            resPerm[decoded_key] = resPerm[key]
            resPerm[key] = undefined
          }
        }
        res.json({results: {status: 1, msg: 'success', resPerm: resPerm}})
      })
    } else {
      return res.status(400).send('empty inputs')
    }
  }
}
