import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Link } from 'react-router-dom'

const useStyles = makeStyles({
	root: {
		flexGrow: 1
	}
})

const tabsArray = [
	{ label: 'Collect', to: '/collect' },
	{ label: 'Clarify', to: '/clarify' },
	{ label: 'Lists', to: '/lists' },
	{ label: 'Engage', to: '/' }
]

export default ({ location }) => {
	const classes = useStyles()
	const [selectedTab, setSelectedTab] = React.useState(0)

	React.useEffect(() => {
		const currentTab = tabsArray.findIndex(
			menuItem => location.pathname === menuItem.to
		)
		if (~currentTab) setSelectedTab(currentTab)
	}, [location])

	return (
		<Paper className={classes.root}>
			<Tabs
				value={selectedTab}
				indicatorColor="primary"
				textColor="primary"
				centered
			>
				{tabsArray.map(menuItem => (
					<Tab label={menuItem.label} component={Link} to={menuItem.to} />
				))}
			</Tabs>
		</Paper>
	)
}
