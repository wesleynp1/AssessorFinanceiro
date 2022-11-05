import React, {Component} from  'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import PaginaInicial from './src/Componentes/paginas/PaginaInicial';
import PaginaNovaTransacao from './src/Componentes/paginas/PaginaNovaTransacao';
import controladorDados from './src/controladores/controladorDados';

const STACK = createStackNavigator();

export default class App extends Component{

  constructor(){
    super();

    this.state = {saldoTotal:"?",transacoes:[{teste:"testando"}]};
    
    this.cd = new controladorDados();
  }

  componentDidMount()
  {
    let saldo,transacoes;
    let atualizaSaldoTransacoes = ()=>{this.setState({saldoTotal:saldo,transacoes:transacoes})}
    
    this.cd.getSaldo().then(r =>{saldo=r;if(transacoes!=undefined)atualizaSaldoTransacoes();});
    this.cd.getTransacoes().then(t =>{transacoes=t;if(saldo!=undefined)atualizaSaldoTransacoes();});
  }

  render()
  {

    
    return(
    <NavigationContainer>
      <STACK.Navigator>

        <STACK.Screen name='Inicial'>
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
            <PaginaNovaTransacao novaTransacao={t =>{this.cd.inserirTransacao(t).then(()=>{alert("deu certo!")})}}
            />
            );
        }}
        </STACK.Screen>

      </STACK.Navigator>
    </NavigationContainer>
    )
  }
}