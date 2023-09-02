import { useState } from 'react';
import { View, TextInput, Button, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import { salvarUsuarioSenha, autenticarAutomaticamente } from '../../controladores/autoautenticador';

const PaginaLogin = ({onLogin})=>{
    const [carregando, setCarregando] = useState(true);
    const [senha, setSenha] = useState("");
    const [usuario, setUsuario] = useState("");
    const [autologinDisponivel, setAutologinDisponivel] = useState(null);

    /*if(autologinDisponivel==null){
      autenticarAutomaticamente().then(l=>{
        if(l==null){
          alert("login automatico falhou");
          setAutologinDisponivel(false);
        }else{
          alert("l:"+l);
          setAutologinDisponivel(true);
        }
      });
    }*/

    if(autologinDisponivel==null){
      autenticarAutomaticamente()
      .then(l=>{
        Alert.alert("LOGIN","Logado automaticamente em " + l.user.email);
        onLogin({conta: l.user});
      })
      .catch(e=>{
        alert(e);
        setAutologinDisponivel(false);
        setCarregando(false);
      });
    }
    
      

    let logar = ()=>{
        if(senha=="" || usuario==""){Alert.alert("Ops!","digite a senha");return;}

        setCarregando(true);

        auth().signInWithEmailAndPassword("wesleynp@google.com",senha)
        .then(u => {
          salvarUsuarioSenha(usuario,senha)
          .then(()=>{onLogin({conta:u.user})})
        })
        .catch(e =>{Alert.alert("Erro de Login","erro:"+e);setCarregando(false)})
    }

    return(
    <View style={{flex:1,justifyContent:"center", alignItems:"center"}}>
      <TextInput 
        style={{color: "white",backgroundColor:"black", width: 256, textAlign:'center'}}
        onChangeText={t=>{setUsuario(t)}}
        placeholder="USUÁRIO"
        autoCapitalize={"none"}
        onSubmitEditing={logar}
        editable={!carregando}
      />

      <TextInput 
        style={{color: "white",backgroundColor:"black", width: 256, textAlign:'center'}}  
        onChangeText={t=>{setSenha(t)}}
        placeholder="SENHA"
        secureTextEntry={true}
        autoCapitalize={"none"}
        onSubmitEditing={logar}
        editable={!carregando}
      />

      <Button 
        title='logar'
        onPress={logar}
        disabled={carregando}
      />
    </View>
    )
}

export default PaginaLogin;