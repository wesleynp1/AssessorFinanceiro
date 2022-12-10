import React, {Component} from  'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View,Text } from 'react-native';

//PÁGINAS TRANSAÇÃO
import PaginaTransacoes from './src/Componentes/paginas/PaginaTransacoes';
import PaginaNovaTransacao from './src/Componentes/paginas/PaginaNovaTransacao';
import PaginaEditarTransacao from './src/Componentes/paginas/PaginaEditarTransacao';

import PaginaContas from './src/Componentes/paginas/PaginaContas';

import conectorBancoDeDados from './src/controladores/conectorBancoDeDados';

const STACK = createStackNavigator();
const TAB = createBottomTabNavigator();

export default class App extends Component{

  constructor(){
    super();
 
    this.state = {transacoes:[],contas:[],carregando:true};

    this.atualizarSaldoTransacoes = this.atualizarSaldoTransacoes.bind(this);
  }

  atualizarSaldoTransacoes()
  {
    console.log("atualizarSaldoTransacoes()");
    
    this.setState({carregando:true})

    let contas,transacoes;
    let atualizaState = ()=>{this.setState({contas:contas, transacoes:transacoes, carregando:false})}
    
    conectorBancoDeDados.getContas().then(c => {contas = c;if(transacoes!=undefined)atualizaState();});
    conectorBancoDeDados.getTransacoes().then(t =>{transacoes=t;if(contas!=undefined)atualizaState();});
  }

  componentDidMount()
  {
    this.atualizarSaldoTransacoes(); 
  }

  render()
  {
    //ENQUANTO AS INFORMAÇÕES ESTIVEREM CARREGANDO
    let telaCarregando = () => {
      return(
        <View style={{flex:1,justifyContent:"center", alignItems:"center"}}>
          <Text>Carregando...</Text>
          <ActivityIndicator size={"large"}/>
          <Text>Só um instante...</Text>
        </View>
      )
    }

    //PAGINAS DE CRUD DE TRANSACOES
    let AbaTransacoes = () => {

      let IniciaPaginaTransacoes = ({navigation})=>{
        return (
          <PaginaTransacoes  
          transacoes={this.state.transacoes} 
          contas={this.state.contas} 
          irParaPaginaNovaTransacao={(d)=>{navigation.navigate("PaginaNovaTransacao",{eDespesa: d})}} 
          irParaPaginaEditarTransacao={(t)=>{navigation.navigate("PaginaEditarTransacao",{transacao:t})}} 
          excluirTransacao={(id)=>{conectorBancoDeDados.excluirTransacao(id).then(this.atualizarSaldoTransacoes)}} 
          />
        ); 
      }

      let IniciaPaginaNovaTransacoes = ({route})=>{
        return (
          <PaginaNovaTransacao 
          novaTransacao={t =>{conectorBancoDeDados.inserirTransacao(t).then(()=>{this.atualizarSaldoTransacoes()})}}
          nomeContas={this.state.contas.map(d => d.id)}
          eDespesa={route.params.eDespesa}
          />
        );
      }

      let IniciaPaginaEditarTransacao = ({route})=>{
        return (
          <PaginaEditarTransacao 
          atualizarTransacao={t =>{conectorBancoDeDados.atualizarTransacao(t).then(this.atualizarSaldoTransacoes)}}
          nomeContas={this.state.contas.map(d => d.id)}
          transacaoInicial={route.params.transacao}
        />
        );
      }

      return(
          <STACK.Navigator initialRouteName='Inicial' screenOptions={{headerShown: false}}>
            <STACK.Screen name='Inicial' component={IniciaPaginaTransacoes} />
            <STACK.Screen name='PaginaNovaTransacao' component={IniciaPaginaNovaTransacoes} />
            <STACK.Screen name='PaginaEditarTransacao' component={IniciaPaginaEditarTransacao}/>
          </STACK.Navigator>
      );
    }

    //PAGINAS DE CRUD DE CONTAS
    let AbaContas = () => {
      return(
        <PaginaContas contas={this.state.contas}/>
      )
    }

    //NAVEGAÇÃO POR ABAS
    let telaNavegacaoTab = () => {
      return(
        <NavigationContainer>
          <TAB.Navigator initialRouteName='transacoes' screenOptions={{headerShown: false}}>
            <TAB.Screen name='transacoes' component={AbaTransacoes}/>
            <TAB.Screen name='contas' component={AbaContas}/>
          </TAB.Navigator>
        </NavigationContainer>
      );
    }

    if(this.state.carregando){
      return telaCarregando();
    }else{
      return telaNavegacaoTab();
    }

  }
}