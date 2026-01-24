import { useState } from "react";
import { View, Text } from "react-native";
import auth, { firebase } from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import Icon from "@react-native-vector-icons/fontawesome";

//PÁGINAS
import PaginaTransacoes from './src/componentes/paginas/PaginaTransacoes';
import PaginaNovaTransacao from './src/componentes/paginas/PaginaNovaTransacao';
import PaginaEditarTransacao from './src/componentes/paginas/PaginaEditarTransacao';
import PaginaContas from './src/componentes/paginas/PaginaContas';
import PaginaEstatistica from './src/componentes/paginas/PaginaEstatisticas';
import PaginaLogin from './src/componentes/paginas/PaginaLogin';
import PaginaCarregando from './src/componentes/paginas/PaginaCarregando';

import conectorBancoDeDados from './src/controladores/conectorBancoDeDados';

const STACK = createStackNavigator();
const TAB = createBottomTabNavigator();

const App = function () {

  const [transacoes, setTransacoes] = useState([]);
  const [contas, setContas] = useState([]);
  const [ano, setAno] = useState(new Date().getFullYear());
  const [carregando, setCarregando] = useState(true);
  const [login, setLogin] = useState(null);


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
        novaTransacao={t => {
          conectorBancoDeDados.inserirTransacao(t)
            .then(() => { buscarSaldoTransacoes() })
        }}
        nomeContas={contas.map(d => d.id)}
        eDespesa={route.params.eDespesa}
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
        nomeContas={contas.map(d => d.id)}
        transacaoInicial={transacaoInicial}
      />
    );
  }

  //ABAS
  function AbaTransacoes() {
    return (
      <STACK.Navigator initialRouteName='Inicial' screenOptions={{ headerShown: false }}>
        <STACK.Screen name='Inicial'>{IniciaPaginaTransacoes}</STACK.Screen>
        <STACK.Screen name='PaginaNovaTransacao' component={IniciaPaginaNovaTransacoes} />
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
          conectorBancoDeDados.transferirEntreContas(contaOrigem, contaDestino, valor)
            .then(() => { buscarSaldoTransacoes() })
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

  function telaNavegacaoTab() {
    return (
      <NavigationContainer>
        <TAB.Navigator initialRouteName='transacoes' screenOptions={{ headerShown: false }}>
          <TAB.Screen name='transacoes' component={AbaTransacoes} />
          <TAB.Screen name='contas' component={AbaContas} />
          <TAB.Screen name='estatistica' component={AbaEstatistica} />
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

  //LOGOUT ANTES DE FECHAR O APP
  //if (login != null) auth().signOut().then(() => firebase.firestore().terminate());
}

export default App;