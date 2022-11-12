import React,{useState} from "react";
import { Text,View,TextInput,StyleSheet, TouchableOpacity } from "react-native";
import CampoDinheiro from "./CampoDinheiro";
import firestore from '@react-native-firebase/firestore';

const FormularioTransacao = ({transacaoInicial,aoSubmeter})=>{
    const [categoria,setCategoria] = useState(transacaoInicial.categoria);
    const [data,setData] = useState(transacaoInicial.data);
    const [conta,setConta] = useState(transacaoInicial.conta);
    const [valor,setValor] = useState(transacaoInicial.valor);

    const aoPressionarRegistrar = ()=>{
        aoSubmeter({
            categoria:categoria,
            data: new Date(data), 
            conta: firestore().doc("usuarios/wesleynp/contas/"+conta),
            valor: parseInt(valor)
        })
    };

    return(
    <View>
        <TextInput  style={estilo.campos}
                    placeholderTextColor="gray"
                    value={categoria}
                    placeholder="Categoria"
                    onChangeText={setCategoria}
                    />

        <TextInput  style={estilo.campos}
                    placeholderTextColor="gray"
                    value={data}
                    placeholder="Data"
                    onChangeText={setData}
                    />

        <TextInput  style={estilo.campos}
                    placeholderTextColor="gray"
                    value={conta}
                    placeholder="Conta"
                    onChangeText={setConta}
                    />

        <CampoDinheiro
                    valorInicial={0}
                    aoMudarTexto={setValor}
                    />
        <TouchableOpacity style={estilo.botaoRegistrar} onPress={aoPressionarRegistrar}>
            <Text>REGISTRAR</Text>
        </TouchableOpacity>

    </View>)
}

const estilo= StyleSheet.create({
    campos:{
        fontSize: 12,
        color:"black",
        textAlign:"center",
        borderColor:"black",
        borderStyle:"solid",
        borderWidth:2,
        margin:10,
        padding: 2},

    botaoRegistrar:{
        backgroundColor:'black',
        height:32,
        justifyContent:"center",
        alignItems:"center",
        margin:10}
})

export default FormularioTransacao;