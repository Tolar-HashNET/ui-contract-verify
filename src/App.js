import './App.css';
import React from 'react';
import { TextInput } from 'react-native';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      solSource: '',
    };

    this.contractUpdated = this.contractUpdated.bind(this)
  }

  handleClick() {
    console.log("----INPUT----")
    console.log(this.state.solSource);
    console.log("----END----")
  }

  contractUpdated(contract) {
    console.log(contract);
    this.setState({
      solSource: contract,
    })
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
        <TextInput
          style={{
            height: 500,
            width: '70%',
            margin: 5,
            padding: 5,
            backgroundColor: "white"
          }}
          placeholder="Paste Solidity code to verify here..."
          multiline={true}
          onChangeText={this.contractUpdated}
        />
        <br/>
            <button
              style={{
                height: 40,
                margin: 5,
              }}
              onClick={() => this.handleClick()}> Verify
            </button>
        </header>
      </div>
    );
  }
}

export default App;
