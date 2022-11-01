import React, {Component} from  'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import PaginaInicial from './src/paginas/PaginaInicial';
import controladorDados from './src/controladores/controladorDados';

const STACK = createStackNavigator();

export default class App extends Component{

  constructor(){
    super();

    this.state = {saldoTotal:0};
    
    this.cd = new controladorDados();
  }

  render()
  {
    return(
    <NavigationContainer>
      <STACK.Navigator>

        <STACK.Screen name='Inicial'>
        {()=>{
            return (
            <PaginaInicial saldoTotal={this.cd.getSaldo()}/>
            );
        }}
        </STACK.Screen>

        <STACK.Screen name='FormularioTransacao'>
        {()=>{
            return (
            <PaginaInicial saldoTotal={this.cd.getSaldo()}/>
            );
        }}
        </STACK.Screen>

      </STACK.Navigator>
    </NavigationContainer>
    )
  }
}

const estiloTextoPadrao = StyleSheet.create({
  color:'black'
})