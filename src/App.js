import React, {Component} from 'react';
import './App.css';

// Initial list of persons
const persons = [{
		id: 0,
		name: 'Peter'
	},
	{
		id: 1,
		name: 'John'
	}
];

// Getting a new unique id for not created person with id < 0
const newPersonId = () => {
	let freeId = -1;
	if (persons.length > 0) {
		for (let i = 0; i < persons.length; i++) {
			if (persons[i]['id'] === freeId) {
				freeId--
			}
		}
	} else {
		return freeId;
	}
	return freeId;
}

// Fake request for 2 seconds
const fakeRequest = (value) => {
	return new Promise(resolve => setTimeout(resolve, 2000, value));
}

// Changing array of persons after creating a new person (person with id < 0 get a new unique id > 0)
const addPerson = (id) => {
	let last = 0;
	persons.forEach(person => {
		if (person.id > last) last = person.id
		if (person.id === id) {
			person.id = last + 1;
		}
	})
	return persons
}

// Changing array of persons after changing name of created person
const renamePerson = (id, value) => {
	persons.forEach(person => {
		if (person.id === id) {
			person.name = value;
		}
	})
	return persons
}

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			request: false,
			persons: persons
		}
	}

	// Adding a new empty person with generated id
	newPerson = () => {
		const newId = newPersonId();
		const emptyPerson = {id: newId, name: ''};
		persons.push(emptyPerson);
		this.setState({persons});
	}

	// Changing name in input
	changeName = (id, value) => {
		const persons = [...this.state.persons];
		persons.forEach(person => {
			if (person.id === id) person.name = value
		})
		this.setState({persons});
	}

	// Changing name of created person
	changePerson = id => {
		this.setState({request: true});
		this.state.persons.forEach(person => {
			person.id === id && fakeRequest(renamePerson(id, person.name)).then(response => {
				this.setState({
					persons: response,
					request: false
				});
			})
		})
	}

	// Making request for adding new person and getting response with new id
	createPerson = (id) => {
		this.setState({request: true})
		fakeRequest(addPerson(id)).then(response => {
			this.setState({
				persons: response,
				request: false
			});
		})
	}

  render() {
    return (
		<div className="App">
			<header className="App-header">
				<p>Burlakov Oleksandr React Test Task</p>
			</header>
			<div className="App-container">
				<button 
					disabled={this.state.request}
					onClick={this.newPerson}
				>
					Add new person
				</button>
				{this.state.persons && this.state.persons.map((person, index) => 
					<div key={index} className="input-name">
						<input defaultValue={person.name} onChange={(e)=>this.changeName(person.id, e.target.value)} />

						{person.id >= 0 && <button 
							onClick={()=>this.changePerson(person.id)}
							disabled={this.state.request}>
							{this.state.request ? 'Please wait' : 'Change'}
						</button>}

						{person.id < 0 && <button
							onClick={()=>this.createPerson(person.id)}
							disabled={this.state.request}>
							{this.state.request ? 'Please wait' : 'Create'}
						</button>}
					</div>)
				}
			</div>
		</div>
    );
  }
}

export default App;
