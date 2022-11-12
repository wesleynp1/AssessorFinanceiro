import React, {Component} from  'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';

import PaginaInicial from './src/Componentes/paginas/PaginaInicial';
import PaginaNovaTransacao from './src/Componentes/paginas/PaginaNovaTransacao';
import controladorDados from './src/controladores/controladorDados';

const STACK = createStackNavigator();

export default class App extends Component{

  constructor(){
    super();
 
    this.state = {saldoTotal:"?",transacoes:[], carregando:true};
    
    this.cd = new controladorDados();

    this.atualizarSaldoTransacoes = this.atualizarSaldoTransacoes.bind(this);
  }

  atualizarSaldoTransacoes()
  {
    this.setState({carregando:true})

    let saldo,transacoes;
    let atualizaState = ()=>{this.setState({saldoTotal:saldo,transacoes:transacoes, carregando: false})}
    
    this.cd.getSaldo().then(r =>{saldo=r;if(transacoes!=undefined)atualizaState();});
    this.cd.getTransacoes().then(t =>{transacoes=t;if(saldo!=undefined)atualizaState();});
  }

  componentDidMount()
  {
    this.atualizarSaldoTransacoes();
  }

  render()
  {

    if(this.state.carregando){
      return(
      <View style={{flex:1,justifyContent:"center"}}>
         <ActivityIndicator size={"large"}/>
      </View>)
    }

    return(
    <NavigationContainer>
      <STACK.Navigator initialRouteName='Inicial'>

        <STACK.Screen name='Inicial' options={{title:"Primeira Página"}}>
        {({navigation})=>{
            return (
            <PaginaInicial  saldoTotal={this.state.saldoTotal}  
                            transacoes={this.state.transacoes} 
                            irParaPaginaNovaTransacao={()=>{navigation.navigate("FormularioTransacao")}} //método para navegar nas páginas
            />
            );
        }}
        </STACK.Screen>

        <STACK.Screen name='FormularioTransacao'>
        {()=>{
            return (
            <PaginaNovaTransacao novaTransacao={t =>{this.cd.inserirTransacao(t).then(()=>{this.atualizarSaldoTransacoes()})}}
            />
            );
        }}
        </STACK.Screen>

      </STACK.Navigator>
    </NavigationContainer>
    )
  }
}