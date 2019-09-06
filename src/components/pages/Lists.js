import React from 'react'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'

const Lists = props => (
	<>
		<h1>Inbox list:</h1>
		<ul>
			{props.items.inbox.map((item, index) => (
				<li key={item.id}>
					{item.title}
					<Typography variant="body1">{item.description}</Typography>
				</li>
			))}
		</ul>
		<h1>Next Actions:</h1>
		<ul>
			{props.items.nextActions.map((item, index) => (
				<li key={item.id}>
					{item.title}
					<Typography variant="body1">{item.description}</Typography>
				</li>
			))}
		</ul>
	</>
)

export default connect(state => ({ items: state.items }))(Lists)
