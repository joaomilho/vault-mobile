import React, { Component } from 'react'
import { Platform, Clipboard, Text, View, TextInput, Button } from 'react-native'
import Vault from 'vault'
import { equals } from 'ramda'

const styles = {
  container: {
    flex: 1,
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: '#dddde1',
  },
  fieldset: {
    paddingVertical: 10,
    color: '#999',
  },
  label: {
    color: '#444449',
  },
  input: {
    height: 40,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
  },
}

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      service: '',
      phrase: '',
      showClipboardMessage: false,
      showPhrase: false,
    }
  }

  setService = service => {
    this.setState({ service })
  }

  setPhrase = phrase => {
    this.setState({ phrase })
  }

  componentWillUpdate(_, { service, phrase }) {
    if (
      this.state.service &&
      this.state.phrase &&
      (!equals(service, this.state.service) || !equals(phrase, this.state.phrase))
    ) {
      const password = new Vault({ phrase }).generate(service)
      Clipboard.setString(password)
      this.setState({ showClipboardMessage: true })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.fieldset}>
          <Text style={styles.label}>Service</Text>
          <TextInput
            style={styles.input}
            onChangeText={this.setService}
            value={this.state.service}
          />
        </View>
        <View style={styles.fieldset}>
          <Text style={styles.label}>Passphrase</Text>
          <Button style={styles.toggleVisibility} title="Show" onPress={this.toggleVisibility} />
          <TextInput
            ref="phrase"
            secureTextEntry={!this.state.showPhrase}
            style={styles.input}
            onChangeText={this.setPhrase}
            value={this.state.phrase}
          />
        </View>
        {this.state.showClipboardMessage ? <Text>Password copied to clipboard</Text> : null}
      </View>
    )
  }
}
