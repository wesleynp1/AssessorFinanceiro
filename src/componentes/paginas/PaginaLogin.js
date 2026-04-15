import React from 'react';
import { useState } from 'react';
import { View, Text, TextInput, Alert, ToastAndroid, StyleSheet, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { salvarUsuarioSenha, autenticarAutomaticamente } from '../../controladores/autoautenticador';

const PaginaLogin = ({ onLogin }) => {
  const [carregando, setCarregando] = useState(true);
  const [senha, setSenha] = useState("");
  const [usuario, setUsuario] = useState("");
  const [autologinDisponivel, setAutologinDisponivel] = useState(null);

  const estilo = StyleSheet.create({
    pagina: { 
      flex: 1, 
      justifyContent: "center", 
      padding: 20
    },
    input:  { 
      color: "white", 
      backgroundColor: carregando ? "#00000059" : "black", 
      textAlign: 'center', 
      alignSelf: "stretch",
      
      borderWidth: 1, 
      borderColor: "#FFF", 
      borderRadius: 8,

      margin: 8
    },
    botao:  { 
      backgroundColor: carregando ? "#0a608848" : "#0a6088", 
      borderRadius: 8,
      padding: 12 
    },
    formulario:{
      flex:2, 
      justifyContent:"space-around",
      borderWidth: 1, 
      borderColor: "#FFF", 
      borderRadius: 8,
      padding: 12
    }
  });

  if (autologinDisponivel == null) {
    autenticarAutomaticamente()
      .then(l => {
        ToastAndroid.show("Logado automaticamente em " + l.user.email, ToastAndroid.LONG);
        onLogin({ conta: l.user });
      })
      .catch(e => {
        alert("Erro ao tentar logar automaticamente: " + e);
        setAutologinDisponivel(false);
        setCarregando(false);
      });


  }

  const logar = () => {
    if (senha == "" || usuario == "") { Alert.alert("Ops!", "digite a senha e o usuário"); return; }

    setCarregando(true);

    auth().signInWithEmailAndPassword(usuario, senha)
      .then(u => {
        salvarUsuarioSenha(usuario, senha)
        onLogin({ conta: u.user })
      })
      .catch(e => { Alert.alert("Erro de Login", "erro:" + e); setCarregando(false) })
  }

  return (
    <View style={estilo.pagina}>

      <View style={{flex:1, justifyContent:"space-evenly"}}>
        <Text style ={{textAlign: "center"}}>Futura Logo Aqui</Text>
      </View>

      <View style={estilo.formulario}>
        <TextInput
          style={estilo.input}
          onChangeText={t => { setUsuario(t) }}
          placeholder="USUÁRIO"
          autoCapitalize={"none"}
          onSubmitEditing={logar}
          editable={!carregando}
        />

        <TextInput
          style={estilo.input}
          onChangeText={t => { setSenha(t) }}
          placeholder="SENHA"
          secureTextEntry={true}
          autoCapitalize={"none"}
          onSubmitEditing={logar}
          editable={!carregando}
        />

        <TouchableOpacity
          style={estilo.botao}
          onPress={logar}
          disabled={carregando}
        >
          <Text style={{ textAlign: "center" }}>LOGIN</Text>
        </TouchableOpacity>
      </View>

      <View style={{flex:1, justifyContent:"space-evenly"}}>
        <TouchableOpacity
          style={estilo.botao}
          onPress={() => {setAutologinDisponivel(null),setCarregando(true)}}
          disabled={carregando}
        >
          <Text style={{ textAlign: "center" }}>Retentar login automático</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

export default PaginaLogin;