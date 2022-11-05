import { useState, useEffect, useContext } from 'react';
import { View, Alert } from 'react-native';
import { Title, List, IconButton, TextInput, Button } from 'react-native-paper';
import { styleSheet } from '../styleSheets/StyleSheet';

import { AccessTokenContext } from '../context/AccessTokenContext';
import { NetworkContext } from '../context/NetworkContext';

const Portions = ({ isEditing, recipeId, recipeSteps }) => {
	const [steps, setSteps] = useState(null);
	const [stepToEdit, setStepToEdit] = useState('');
	const [editStep, setEditStep] = useState('');
	const [editStepDesc, setEditStepDesc] = useState('');
	const [addStep, setAddStep] = useState(false);
	const [newStep, setNewStep] = useState('');
	const [newStepDesc, setNewStepDesc] = useState('');

	const accessToken = useContext(AccessTokenContext);
	const { patchRecipeStep, request } = useContext(NetworkContext);

	const patch = async (stepId, editStep, editStepDesc) => {
		let bodyObj = {
			StepId: stepId,
		};
		if (editStep) {
			bodyObj = { ...bodyObj, Step: editStep };
		}
		if (editStepDesc) {
			bodyObj = { ...bodyObj, StepDesc: editStepDesc };
		}
		let response = await request(accessToken, bodyObj, 'recipestep', 'PATCH');
		if (response) {
			console.log('After patch');
			let tmpSteps;
			if (editStep && editStepDesc) {
				tmpSteps = steps.map((step) =>
					step.StepId === stepId
						? { ...step, Step: editStep, StepDesc: editStepDesc }
						: step
				);
			} else if (editStep) {
				tmpSteps = steps.map((step) =>
					step.StepId === stepId ? { ...step, Step: editStep } : step
				);
			} else {
				tmpSteps = steps.map((step) =>
					step.StepId === stepId ? { ...step, StepDesc: editStepDesc } : step
				);
			}

			let sortedSteps = tmpSteps.sort((a, b) => {
				return a.Step - b.Step;
			});
			setSteps(sortedSteps);
			setStepToEdit('');
			setEditStep('');
			setEditStepDesc('');
		} else {
			console.log('patch failed');
			console.log(response);
		}
	};

	const confirmDelete = (stepId) => {
		return Alert.alert('Description will be removed', '', [
			// The "Yes" button
			{
				text: 'Yes',
				onPress: async () => {
					let bodyObj = {
						StepId: stepId,
					};
					let response = await request(
						accessToken,
						bodyObj,
						'recipestep',
						'DELETE'
					);
					if (response) {
						console.log('After delete');
						let tmpSteps = [];
						for (let i = 0; i < steps.length; i++) {
							if (stepId != steps[i].StepId) {
								tmpSteps = tmpSteps.concat(steps[i]);
							}
						}
						let sortedSteps = tmpSteps.sort((a, b) => {
							return a.Step - b.Step;
						});
						setSteps(sortedSteps);
						setStepToEdit('');
						setEditStep('');
						setEditStepDesc('');
					} else {
						console.log('delete failed');
						console.log(response);
					}
				},
			},
			// The "No" button
			// Does nothing but dismiss the dialog when tapped
			{
				text: 'No',
				onPress: () => {
					alert('no');
				},
			},
		]);
	};

	const add = async (recipeId, newStep, newStepDesc) => {
		console.log('In add');

		if (recipeId && newStep && newStepDesc) {
			let bodyObj = {
				Step: newStep,
				RecipeId: recipeId,
				StepDesc: newStepDesc,
			};
			let response = await request(accessToken, bodyObj, 'recipestep', 'POST');

			if (response.insertId) {
				console.log('After add');
				let tmpSteps = steps.concat({
					StepId: response.insertId,
					Step: newStep,
					StepDesc: newStepDesc,
				});
				let sortedSteps = tmpSteps.sort((a, b) => {
					return a.Step - b.Step;
				});
				setSteps(sortedSteps);
				setNewStep('');
				setNewStepDesc('');
				setAddStep(false);
			}
		} else {
			alert('Failed to add');
		}
	};

	useEffect(() => {
		if (recipeSteps) {
			let sortedSteps = recipeSteps.sort((a, b) => {
				return a.Step - b.Step;
			});
			setSteps(sortedSteps);
		}
	}, [recipeSteps]);

	useEffect(() => {
		setStepToEdit('');
		setEditStep('');
		setEditStepDesc('');
		setNewStep('');
		setNewStepDesc('');
		setAddStep(false);
	}, [isEditing]);

	console.log(steps);

	if (steps && !isEditing) {
		return (
			<>
				<Title style={styleSheet.recipeTitle}>Steps:</Title>
				{steps.map((step) => {
					return (
						<List.Item
							key={step.StepId}
							title={step.Step + '. ' + step.StepDesc}
						/>
					);
				})}
			</>
		);
	} else if (isEditing) {
		return (
			<>
				<Title style={styleSheet.recipeTitle}>Steps:</Title>
				{steps.map((step) => {
					if (stepToEdit === step.StepId) {
						return (
							<View key={step.StepId} style={styleSheet.recipeInputContainer}>
								<TextInput
									style={styleSheet.recipeStep}
									label={step.Step}
									value={editStep}
									mode='outlined'
									keyboardType='numeric'
									onChangeText={setEditStep}
								/>
								<TextInput
									style={styleSheet.recipeStepDesc}
									value={editStepDesc}
									mode='outlined'
									multiline={true}
									onChangeText={setEditStepDesc}
									onSubmitEditing={() => {
										patch(step.StepId, editStep, editStepDesc);
									}}
								/>
								<IconButton
									icon='check-outline'
									size={20}
									onPress={() => {
										patch(step.StepId, editStep, editStepDesc);
									}}
								/>
								<IconButton
									icon='delete-outline'
									size={20}
									onPress={() => {
										confirmDelete(stepToEdit);
									}}
								/>
								<IconButton
									icon='pencil-off'
									size={20}
									onPress={() => {
										setEditStep('');
										setStepToEdit('');
									}}
								/>
							</View>
						);
					} else {
						return (
							<List.Item
								key={step.Step}
								title={step.Step + '. ' + step.StepDesc}
								right={() => (
									<IconButton
										icon='pencil'
										size={15}
										onPress={() => {
											setStepToEdit(step.StepId);
											setEditStepDesc(step.StepDesc);
										}}
									/>
								)}
							/>
						);
					}
				})}
				{isEditing && !addStep && (
					<Button
						icon='plus-circle-outline'
						labelStyle={styleSheet.addButtonLabelStyle}
						style={styleSheet.addButton}
						onPress={async () => {
							setAddStep(true);
						}}
					/>
				)}
				{isEditing && addStep && (
					<View style={styleSheet.recipeInputContainer}>
						<TextInput
							style={styleSheet.recipeStep}
							label='#'
							value={newStep}
							mode='outlined'
							keyboardType='numeric'
							onChangeText={setNewStep}
						/>
						<TextInput
							style={styleSheet.recipeStepDesc}
							value={newStepDesc}
							mode='outlined'
							multiline={true}
							onChangeText={setNewStepDesc}
							onSubmitEditing={() => {
								add(recipeId, newStep, newStepDesc);
							}}
						/>
						<IconButton
							icon='check-outline'
							size={20}
							onPress={() => {
								add(recipeId, newStep, newStepDesc);
							}}
						/>
						<IconButton
							icon='pencil-off'
							size={20}
							onPress={() => {
								setAddStep(false);
								setNewStep('');
								setNewStepDesc('');
							}}
						/>
					</View>
				)}
			</>
		);
	} else {
		return <></>;
	}
};

export default Portions;
