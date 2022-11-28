import React, {Component} from  'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View,Text } from 'react-native';

import PaginaInicial from './src/Componentes/paginas/PaginaInicial';
import PaginaNovaTransacao from './src/Componentes/paginas/PaginaNovaTransacao';
import controladorDados from './src/controladores/controladorDados';
import PaginaEditarTransacao from './src/Componentes/paginas/PaginaEditarTransacao';

const STACK = createStackNavigator();

export default class App extends Component{

  constructor(){
    super();
 
    this.state = {transacoes:[],contas:[],carregando:true};
    
    this.cd = new controladorDados();

    this.atualizarSaldoTransacoes = this.atualizarSaldoTransacoes.bind(this);
  }

  atualizarSaldoTransacoes()
  {
    this.setState({carregando:true})

    let contas,transacoes;
    let atualizaState = ()=>{this.setState({contas:contas, transacoes:transacoes, carregando:false})}
    
    this.cd.getContas().then(c => {contas = c;if(transacoes!=undefined)atualizaState();});
    this.cd.getTransacoes().then(t =>{transacoes=t;if(contas!=undefined)atualizaState();});
  }

  componentDidMount()
  {
    this.atualizarSaldoTransacoes();
  }

  render()
  {

    if(this.state.carregando){
      return(
      <View style={{flex:1,justifyContent:"center", alignItems:"center"}}>
        <Text>Carregando...</Text>
        <ActivityIndicator size={"large"}/>
        <Text>Só um instante...</Text>
      </View>)
    }    

    return(
    <NavigationContainer>
      <STACK.Navigator initialRouteName='Inicial' screenOptions={{headerShown: false}}>

        <STACK.Screen name='Inicial' options={{title:"Primeira Página"}}>
        {({navigation})=>{
            return (
            <PaginaInicial  transacoes={this.state.transacoes}
                            contas={this.state.contas}
                            
                            irParaPaginaNovaTransacao={(d)=>{navigation.navigate("PaginaNovaTransacao",{eDespesa: d})}} //método para navegar nas páginas
                            irParaPaginaEditarTransacao={(t)=>{navigation.navigate("PaginaEditarTransacao",{transacao:t})}}
                            excluirTransacao={(id)=>{this.cd.excluirTransacao(id).then(this.atualizarSaldoTransacoes())}}
            />
            );
        }}
        </STACK.Screen>

        <STACK.Screen name='PaginaNovaTransacao'>
        {({route})=>{
            return (
            <PaginaNovaTransacao novaTransacao={t =>{this.cd.inserirTransacao(t).then(()=>{this.atualizarSaldoTransacoes()})}}
                                 nomeContas={this.state.contas.map(d => d.id)}
                                 eDespesa={route.params.eDespesa}
            />
            );
        }}
        </STACK.Screen>

        <STACK.Screen name='PaginaEditarTransacao'>
        {({route})=>{
            return (
            <PaginaEditarTransacao atualizarTransacao={t =>{this.cd.atualizarTransacao(t).then(()=>{this.atualizarSaldoTransacoes()})}}
                                   nomeContas={this.state.contas.map(d => d.id)}
                                   transacaoInicial={route.params.transacao}
            />
            );
        }}
        </STACK.Screen>

      </STACK.Navigator>
    </NavigationContainer>
    )
  }
}