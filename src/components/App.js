import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { Header, Footer } from './layouts'
import { Engage, Collect, Lists, Clarify } from './pages'

function App(props) {
	return (
		<Router>
			<Route
				render={({ location }) => {
					return <Header location={location} />
				}}
			/>
			<Switch>
				<Route exact path="/" component={Engage} />
				<Route exact path="/collect" component={Collect} />
				<Route exact path="/clarify" component={Clarify} />
				<Route exact path="/lists" component={Lists} />
			</Switch>
			<Footer />
		</Router>
	)
}

export default App
