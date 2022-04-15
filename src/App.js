import './App.css';
import React from 'react';
import { TextInput, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { evm_versions, compiler_versions } from './consts';

var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      solSource: '',
      bytecode: '',
      contractAddress: '',
      contractFilename: '',
      compilerVersion: 'v0.8.13+commit.abaa5c0e',
      evmVersion: 'london',
      optimized: false,
      optimizationRuns: 200,
    };

    this.contractUpdated = this.contractUpdated.bind(this)
    this.contractAddressUpdated = this.contractAddressUpdated.bind(this)
    this.contractFilenameUpdated = this.contractFilenameUpdated.bind(this)
  }

  verify(codestring, address) {
    // Build the post string from an object
    var post_data = querystring.stringify({
        'contract_code' : codestring,
        'contract_address': address,
        'compiler_version': this.state.compilerVersion,
        'contract_filename': this.state.contractFilename,
        'evm_version': this.state.evmVersion,
        'optimized': this.state.optimized,
        'optimization_runs': this.state.optimizationRuns,
    });
  
    // An object of options to indicate where to post to
    var post_options = {
        host: '127.0.0.1',
        port: '3003',
        path: '/verify',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };
  
    var self = this;

    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
            self.setState({
              bytecode: chunk,
            });
        });
    });
  
    // post the data
    post_req.write(post_data);
    post_req.end();
  }

  handleClick() {
    console.log("----INPUT----")
    console.log(this.state.solSource);
    console.log(this.state.contractAddress);
    console.log(this.state.compilerVersion);
    console.log(this.state.evmVersion);
    console.log("----END----")
    this.verify(this.state.solSource, this.state.contractAddress)
  }

  contractFilenameUpdated(filename) {
    this.setState({
      contractFilename: filename
    })
  }

  contractUpdated(contract) {
    console.log(contract);
    this.setState({
      solSource: contract,
    })
  }

  contractAddressUpdated(address) {
    console.log(address);
    this.setState({
      contractAddress: address,
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
        <TextInput
          style={{
            width: '70%',
            margin: 5,
            padding: 5,
            backgroundColor: "white"
          }}
          placeholder="Type tolar contract address"
          multiline={false}
          onChangeText={this.contractAddressUpdated}
        />
        <TextInput
          style={{
            width: '70%',
            margin: 5,
            padding: 5,
            backgroundColor: "white"
          }}
          placeholder="Type contract filename (must be same as when contract was compiled)"
          multiline={false}
          onChangeText={this.contractFilenameUpdated}
        />
        <div className="basics">
        Compiler version
        <Picker
          selectedValue={this.state.compilerVersion}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({compilerVersion: itemValue})
          }>
          {compiler_versions.map((item, index) => {
            return (<Picker.Item label={item} value={item} key={index}/>) 
          })}
        </Picker>
        </div>
        <div className="basics">
        Evm version
        <Picker
          selectedValue={this.state.evmVersion}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({evmVersion: itemValue})
          }>
          {evm_versions.map((item, index) => {
            return (<Picker.Item label={item} value={item} key={index}/>) 
          })}
        </Picker>
        </div>
        <div className="basics">
          Optimization
          <Picker
            selectedValue={this.state.optimized}
            onValueChange={status => this.setState({optimized: status})}>
            <Picker.Item label="True" value={true} />
            <Picker.Item label="False" value={false} />
          </Picker>
          <TextInput
            style={{
              margin: 5,
              padding: 5,
              backgroundColor: "white"
            }}
            value={this.state.optimizationRuns}
            multiline={false}
            keyboardType="numeric"
            onChangeText={(newText) => this.setState({optimizationRuns: newText})}
          />
        </div>
        <br/>
            <button
              style={{
                height: 40,
                margin: 5,
              }}
              onClick={() => this.handleClick()}> Verify
            </button>
        <br/>
        {this.state.bytecode.length > 0 ?
        <Text style={{
            height: 500,
            width: '70%',
            margin: 5,
            padding: 5,
            backgroundColor: "white",
        }}>
        {this.state.bytecode}
        </Text> : null }
        </header>
      </div>
    );
  }
}

export default App;
