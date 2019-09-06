import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MobileStepper from '@material-ui/core/MobileStepper'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import { connect } from 'react-redux'
import PersonIcon from '@material-ui/icons/Person'
import Fab from '@material-ui/core/Fab'
import { clarifyToNextAction } from '../../redux/actions'
const useStyles = makeStyles(theme => ({
	root: {
		maxWidth: 400,
		flexGrow: 1
	},
	fab: {
		margin: theme.spacing(1)
	},
	extendedIcon: {
		marginRight: theme.spacing(1)
	}
}))
const ClarifyItems = ({ items, clarifyToNextAction }) => {
	const classes = useStyles()
	const [activeStep, setActiveStep] = useState(0)
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')

	useEffect(() => {
		console.log()
		setTitle(items[activeStep].title)
		setDescription(items[activeStep].description)
	}, [items, activeStep])

	return (
		<>
			<MobileStepper
				variant="dots"
				steps={items.length}
				position="static"
				activeStep={activeStep}
				className={classes.root}
				nextButton={
					<Button
						size="small"
						onClick={() => setActiveStep(prevActiveStep => prevActiveStep + 1)}
						disabled={activeStep >= items.length - 1}
					>
						Next
					</Button>
				}
				backButton={
					<Button
						size="small"
						onClick={() => setActiveStep(prevActiveStep => prevActiveStep - 1)}
						disabled={activeStep === 0}
					>
						Back
					</Button>
				}
			/>
			<Paper>
				<form>
					<TextField
						id="title"
						value={title}
						className={classes.textField}
						label="Title"
						variant="filled"
						required
						onChange={({ target: { value } }) => setTitle(value)}
					/>
					<br />
					<TextField
						id="description"
						value={description}
						className={classes.textField}
						label="Description"
						variant="filled"
						required
						onChange={({ target: { value } }) => setDescription(value)}
					/>
					<Fab
						onClick={() =>
							clarifyToNextAction({
								id: items[activeStep].id,
								title,
								description
							})
						}
						variant="extended"
						color="primary"
						aria-label="add"
						className={classes.fab}
					>
						<PersonIcon />
						Next Actions
					</Fab>
				</form>
			</Paper>
		</>
	)
}

const Clarify = props => {
	if (props.items.length === 0) return <div>nothing to clarify</div>
	return <ClarifyItems {...props} />
}
export default connect(
	state => ({ items: state.items.inbox }),
	{ clarifyToNextAction }
)(Clarify)
