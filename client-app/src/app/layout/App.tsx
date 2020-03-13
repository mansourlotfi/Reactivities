import React, { useState, useEffect, Fragment, SyntheticEvent } from 'react';
import { Container } from 'semantic-ui-react';
//import axios from 'axios';
import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

const App = () => {
	const [ activities, setActivities ] = useState<IActivity[]>([]);
	const [ selectedActivity, setSelectedActivity ] = useState<IActivity | null>(null);
	const [ editMode, setEditMode ] = useState(false);
	const [ loading, setLoading ] = useState(true);
	const [ submiting, setSubmiting ] = useState(false);
	const [ target, setTarget ] = useState('');

	const handleSelectedActivity = (id: string) => {
		setSelectedActivity(activities.filter((a) => a.id === id)[0]);
		setEditMode(false);
	};

	const handleOpenCreateForm = () => {
		setSelectedActivity(null);
		setEditMode(true);
	};

	const handleCreateActivity = (activity: IActivity) => {
		setSubmiting(true);
		agent.Activities
			.create(activity)
			.then(() => {
				setActivities([ ...activities, activity ]);
				setSelectedActivity(activity);
				setEditMode(false);
			})
			.then(() => setSubmiting(false));
	};
	const handleEdithActivity = (activity: IActivity) => {
		setSubmiting(true);
		agent.Activities
			.update(activity)
			.then(() => {
				setActivities([ ...activities.filter((a) => a.id !== activity.id), activity ]);
				setSelectedActivity(activity);
				setEditMode(false);
			})
			.then(() => setSubmiting(false));
	};

	const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
		setSubmiting(true);
		setTarget(event.currentTarget.name);
		agent.Activities
			.delete(id)
			.then(() => {
				setActivities([ ...activities.filter((a) => a.id !== id) ]);
			})
			.then(() => setSubmiting(false));
	};

	useEffect(() => {
		agent.Activities
			.list()
			.then((response) => {
				let activities: IActivity[] = [];
				response.forEach((activity) => {
					activity.date = activity.date.split('.')[0];
					activities.push(activity);
				});
				setActivities(activities);
			})
			.then(() => setLoading(false));
	}, []);

	if (loading) return <LoadingComponent content="loading Activities..." />;

	// useEffect(() => {
	// 	axios.get<IActivity[]>('http://localhost:5000/api/activities').then((response) => {
	// 		let activities: IActivity[] = [];
	// 		response.data.forEach((activity) => {
	// 			activity.date = activity.date.split('.')[0];
	// 			activities.push(activity);
	// 		});
	// 		setActivities(activities);
	// 	});
	// }, []);

	// componentDidMount() {
	// 	axios.get<IActivity[]>('http://localhost:5000/api/activities').then((response) => {
	// 		this.setState({
	// 			activities: response.data
	// 		});
	// 	});
	// }

	return (
		<Fragment>
			<NavBar openCreateForm={handleOpenCreateForm} />
			<Container style={{ display: 'inline-block', marginTop: '7em', paddingLeft: '10%' }}>
				<ActivityDashboard
					activities={activities}
					selectActivity={handleSelectedActivity}
					selectedActivity={selectedActivity}
					editMode={editMode}
					setEditMode={setEditMode}
					setSelectedActivity={setSelectedActivity}
					createActivity={handleCreateActivity}
					edithActivity={handleEdithActivity}
					deleteActivity={handleDeleteActivity}
					submiting={submiting}
					target={target}
				/>
			</Container>
		</Fragment>
	);
};

export default App;
