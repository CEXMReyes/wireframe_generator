var CaseNotificationView = require('isight/public/views/settings/case-notification/' +
	'case-notification-details-view.js?original');

module.exports = CaseNotificationView.extend({
	getFilterAttributes: function () {
		var attributes = {};

		// Filter Field
		if (this.model.get('filterField')) {
			attributes.filterField = this.model.get('filterField');
		}

		// WARNING: Match these patterns with trigger-model.js
		var event = this.model.get('event');
		//If this is a user generated workflow save the transitionId
		if(event && event.lastIndexOf('wf-', 0) === 0){
			//set the target
			var entitybase = this.$('#' + event).attr('entitybase');
			var entityname = this.$('#' + event).attr('entityname');
			this.model.set('target', entitybase + '/' + entityname);
			attributes.transitionId = {
				from: '*',
				to: event.replace('wf-', '')
			};
		} else {
			switch (event) {
				case 'Case Cancel':
					attributes.caseStatus = {
						from: '*',
						to: 'canceled'
					};
					break;
				case 'Case Closed':
					attributes.caseStatus = {
						from: '*',
						to: 'closed'
					};
					break;
				case 'Case Reopened':
					attributes._multi = true;
					attributes.or = [{
						caseStatus: {
							from: 'closed',
							to: 'open'
						}
					}, {
						caseStatus: {
							from: 'canceled',
							to: 'open'
						}
					}];
					break;
				case 'New Case Submitted':
					attributes.caseStatus = {
						from: ['empty', 'draft'],
						to: ['open', 'closed']
					};
					break;
				case 'Reassigned Cases':
					attributes._multi = true;
					attributes.or = [{
						caseStatus: {
							from: 'draft',
							to: '*'
						}
					}, {
						owner: {
							from: '*',
							to: '*'
						}
					}];
					break;
				default:
					break;
			}
		}
		return attributes;
	}
});