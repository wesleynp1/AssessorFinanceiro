import React from 'react';
import { useState } from "react";
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//PÁGINAS
import PaginaTransacoes from './src/componentes/paginas/PaginaTransacoes';
import PaginaNovaTransacao from './src/componentes/paginas/PaginaNovaTransacao';
import PaginaEditarTransacao from './src/componentes/paginas/PaginaEditarTransacao';
import PaginaContas from './src/componentes/paginas/PaginaContas';
import PaginaEstatistica from './src/componentes/paginas/PaginaEstatisticas';
import PaginaLogin from './src/componentes/paginas/PaginaLogin';
import PaginaCarregando from './src/componentes/paginas/PaginaCarregando';
import PaginaFaturas from './src/componentes/paginas/PaginaFaturas';

import conectorBancoDeDados from './src/controladores/conectorBancoDeDados';
import provedorDeCategorias from './src/controladores/provedorDeCategorias';


const STACK = createStackNavigator();
const TAB = createBottomTabNavigator();

const App = function () {

  const [transacoes, setTransacoes] = useState([]);
  const [contas, setContas] = useState([]);
  const [ano, setAno] = useState(new Date().getFullYear());
  const [carregando, setCarregando] = useState(true);
  const [login, setLogin] = useState(null);
  const nomeContas = contas.map(d => d.id);
  const categorias = provedorDeCategorias(transacoes)

  function erro(e){
    Alert.alert("Erro na transferência entre contas",e.message);
    setCarregando(false);
  }

  function buscarSaldoTransacoes(anoTr = new Date().getFullYear()) {
    setCarregando(true);

    let contasRecuperadas, transacoesRecuperadas;

    const atualizaState = () => {
      setContas(contasRecuperadas);
      setTransacoes(transacoesRecuperadas);
      setAno(anoTr);
      setCarregando(false);
    };

    conectorBancoDeDados.getContas()
      .then(c => {
        contasRecuperadas = c;
        if (transacoesRecuperadas != undefined) atualizaState();
      })
      .catch(() => {
        alert("Falha ao acessar o banco de dados de transações")
      });

    conectorBancoDeDados.getTransacoes(anoTr)
      .then(t => {
        transacoesRecuperadas = t;
        if (contasRecuperadas != undefined) atualizaState();
      })
      .catch(() => {
        alert("Falha ao recuperar Contas e Transações");
      });
  }

  //PÁGINAS
  function IniciaPaginaTransacoes() {
    return <PaginaTransacoes
      transacoes={transacoes}
      contas={contas}
      ano={ano}
      selecionarAno={a => { buscarSaldoTransacoes(a); }}
      excluirTransacao={(id) => {
        conectorBancoDeDados.excluirTransacao(id)
          .then(buscarSaldoTransacoes)
      }} />
  }

  function IniciaPaginaNovaTransacoes({ route }) {
    return (
      <PaginaNovaTransacao
        registrarNovaTransacao={t => {
          setCarregando(true);
          conectorBancoDeDados.inserirTransacao(t)
            .then(() => { buscarSaldoTransacoes() })
        }}
        nomeContas={nomeContas}
        eDespesa={route.params.eDespesa}
        categorias={categorias}
        ultimaContaUtilizada = {transacoes[0].conta}
      />
    );
  }

  function IniciaPaginaEditarTransacao({ route }) {
    let transacaoInicial = transacoes.find(t => t.id == route.params.id);

    return (
      <PaginaEditarTransacao
        atualizarTransacao={t => {
          conectorBancoDeDados.atualizarTransacao(t)
            .then(buscarSaldoTransacoes)
        }}
        nomeContas={nomeContas}
        transacaoInicial={transacaoInicial}
        categorias={categorias}
      />
    );
  }

  //ABAS
  function AbaTransacoes() {
    return (
      <STACK.Navigator initialRouteName='Inicial' screenOptions={{ headerShown: false }}>
        <STACK.Screen name='Inicial'               component={IniciaPaginaTransacoes}/>
        <STACK.Screen name='PaginaNovaTransacao'   component={IniciaPaginaNovaTransacoes} />
        <STACK.Screen name='PaginaEditarTransacao' component={IniciaPaginaEditarTransacao} />
      </STACK.Navigator>
    );
  }

  function AbaContas() {
    return (
      <PaginaContas
        contas={contas}
        transacoes={transacoes}
        tranferirEntreContas={(contaOrigem, contaDestino, valor) => {
          setCarregando(true);
          try{
            conectorBancoDeDados
            .transferirEntreContas(contaOrigem, contaDestino, valor)
            .then(buscarSaldoTransacoes,erro)
          }catch(e){erro(e)}
        }}
      />
    )
  }

  function AbaEstatistica() {
    return (
      <PaginaEstatistica
        ano={ano}
        transacoes={transacoes}
        selecionarAno={a => { buscarSaldoTransacoes(a); }}
      />
    )
  }   

  function AbaCredito(){ 
    return(<PaginaFaturas buscarSaldoTransacoes={buscarSaldoTransacoes} nomeContas={nomeContas}/>);
  }

  function telaNavegacaoTab() {
    return (
      <NavigationContainer>
        <TAB.Navigator initialRouteName='transacoes' screenOptions={{ headerShown: false }}>
          <TAB.Screen name='Transações'  component={AbaTransacoes} />
          <TAB.Screen name='Contas'      component={AbaContas} />
          <TAB.Screen name='Estatística' component={AbaEstatistica} />
          <TAB.Screen name='Crédito'     component={AbaCredito} />
        </TAB.Navigator>
      </NavigationContainer>
    );
  }

  if (login == null) {
    return <PaginaLogin onLogin={l => {
        setLogin(l);
        buscarSaldoTransacoes();
      }
    } />;
  }

  if (carregando) return <PaginaCarregando />;

  return telaNavegacaoTab();
}

export default App;