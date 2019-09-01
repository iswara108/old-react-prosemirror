import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { Header, Footer } from './layouts'
import { Engage, Collect } from './pages'

function App() {
	return (
		<Router>
			<Header />
			<Switch>
				<Route exact path="/" component={Engage} />
				<Route exact path="/collect" component={Collect} />
			</Switch>
			<h1>Hi from React</h1>
			<Footer />
		</Router>
	)
}

export default App
