var EventEmitter = require('events')
var github = require('./github')

exports.parseEvent = function(snsEvent) {
  var build = new BuildInfo()

  var innerEvent

  try {
    innerEvent = JSON.parse(snsEvent.Message)
  } catch (e) {
    throw new Error(`Could not parse SNS message string as JSON: ${e.message}`)
  }

  // Currently only GitHub is supported as a source
  // eventType will be 'push' or 'pull_request'
  var eventType = ((snsEvent.MessageAttributes || {})['X-Github-Event'] || {}).Value

  return github.parseEvent(innerEvent, eventType, build)
}

function BuildInfo(startedAt) {
  this.startedAt = startedAt || new Date()

  this.status = 'pending'
  this.statusEmitter = new EventEmitter()

  this.project = ''
  this.buildNum = 0

  this.ignore = false
  this.event = null
  this.eventType = ''
  this.repo = ''
  this.isPrivate = true

  this.trigger = ''
  this.branch = ''
  this.cloneRepo = ''
  this.checkoutBranch = ''
  this.commit = ''
  this.baseCommit = ''
  this.comment = ''
  this.user = ''

  this.committers = null

  this.isFork = false
  this.prNum = 0
}

