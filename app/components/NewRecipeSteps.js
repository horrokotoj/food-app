import { useState, useEffect, useContext } from 'react';
import { View, Alert } from 'react-native';
import { Title, List, IconButton, TextInput, Button } from 'react-native-paper';
import { styleSheet } from '../styleSheets/StyleSheet';

const NewPortions = ({ recipeSteps, setRecipeSteps }) => {
	const [stepToEdit, setStepToEdit] = useState('');
	const [editStep, setEditStep] = useState('');
	const [editStepDesc, setEditStepDesc] = useState('');
	const [addStep, setAddStep] = useState(false);
	const [newStep, setNewStep] = useState('1');
	const [newStepDesc, setNewStepDesc] = useState('');

	const patch = (fakeStepId, editStep, editStepDesc) => {
		console.log('After patch');
		let tmpSteps;
		if (editStep && editStepDesc) {
			tmpSteps = recipeSteps.map((step) =>
				step.FakeStepId === fakeStepId
					? { ...step, Step: editStep, StepDesc: editStepDesc }
					: step
			);
		} else if (editStep) {
			tmpSteps = recipeSteps.map((step) =>
				step.FakeStepId === fakeStepId ? { ...step, Step: editStep } : step
			);
		} else if (editStepDesc) {
			tmpSteps = recipeSteps.map((step) =>
				step.FakeStepId === fakeStepId
					? { ...step, StepDesc: editStepDesc }
					: step
			);
		} else {
			alert('Falied to patch');
			return;
		}

		let sortedSteps = tmpSteps.sort((a, b) => {
			return a.Step - b.Step;
		});
		setRecipeSteps(sortedSteps);
		setStepToEdit('');
		setEditStep('');
		setEditStepDesc('');
	};

	const confirmDelete = (fakeStepId) => {
		return Alert.alert('Description will be removed', '', [
			// The "Yes" button
			{
				text: 'Yes',
				onPress: () => {
					console.log('In confermDelete');
					console.log(fakeStepId);
					if (fakeStepId != null) {
						let tmpSteps = [];
						for (let i = 0; i < recipeSteps.length; i++) {
							if (fakeStepId != recipeSteps[i].FakeStepId) {
								tmpSteps = tmpSteps.concat(recipeSteps[i]);
							}
						}
						let sortedSteps = tmpSteps.sort((a, b) => {
							return a.Step - b.Step;
						});
						setRecipeSteps(sortedSteps);
						setStepToEdit('');
						setEditStep('');
						setEditStepDesc('');
					} else {
						alert('Delete failed');
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

	const add = (newStep, newStepDesc) => {
		console.log('In add');

		if (newStep && newStepDesc) {
			let fakeStepId = 0;
			for (let i = 0; i < recipeSteps.length; i++) {
				if (recipeSteps[i].FakeStepId >= fakeStepId) {
					fakeStepId = recipeSteps[i].FakeStepId + 1;
				}
			}

			let tmpSteps = recipeSteps.concat({
				FakeStepId: fakeStepId,
				Step: newStep,
				StepDesc: newStepDesc,
			});
			let sortedSteps = tmpSteps.sort((a, b) => {
				return a.Step - b.Step;
			});
			setRecipeSteps(sortedSteps);
			setStepToEdit('');
			if (sortedSteps.length > 0) {
				setNewStep(
					(parseInt(sortedSteps[sortedSteps.length - 1].Step) + 1).toString()
				);
			} else {
				setNewStep('1');
			}
			setNewStepDesc('');
			setAddStep(false);
		} else {
			alert('Failed to add');
		}
	};

	console.log(recipeSteps);

	return (
		<>
			<Title style={styleSheet.recipeTitle}>Steps:</Title>
			{recipeSteps &&
				recipeSteps.map((step) => {
					if (stepToEdit === step.FakeStepId) {
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
									label={step.StepDesc}
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
								key={step.FakeStepId}
								title={step.Step + '. ' + step.StepDesc}
								right={() => (
									<IconButton
										icon='pencil'
										size={15}
										onPress={() => {
											setStepToEdit(step.FakeStepId);
											setEditStepDesc(step.StepDesc);
										}}
									/>
								)}
							/>
						);
					}
				})}
			{!addStep && (
				<Button
					icon='plus-circle-outline'
					labelStyle={styleSheet.addButtonLabelStyle}
					style={styleSheet.addButton}
					onPress={async () => {
						setAddStep(true);
					}}
				/>
			)}
			{addStep && (
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
							add(newStep, newStepDesc);
						}}
					/>
					<IconButton
						icon='check-outline'
						size={20}
						onPress={() => {
							add(newStep, newStepDesc);
						}}
					/>
					<IconButton
						icon='pencil-off'
						size={20}
						onPress={() => {
							setAddStep(false);
							setNewStepDesc('');
						}}
					/>
				</View>
			)}
		</>
	);
};

export default NewPortions;
