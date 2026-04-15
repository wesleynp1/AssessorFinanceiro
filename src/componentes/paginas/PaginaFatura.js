import React from 'react';
import { useState, useEffect } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import conectorBancoDeDados from '../../controladores/conectorBancoDeDados';
import PaginaCarregando from "./PaginaCarregando";
import Fatura from '../Fatura';

function PaginaFatura(){
    const [carregando,setCarregando] = useState(true);
    const [faturas,setFaturas] = useState([]);
    useEffect(buscarDados,[])  

    //CRUD LANCAMENTO
    function novoLancamento(faturaId){
        let agora  = new Date();
        setCarregando(true)
        conectorBancoDeDados
        .inserirLancamento({categoria:"testandoCat",valor: (agora.getSeconds()*-17), data: agora},faturaId)
        .then(()=> buscarDados())
        .catch((erro)=>{Alert.alert("ERRO","Erro ao adicionar lancamento: "+erro)})
    }

    function deletarLancamento(id,faturaId){
        setCarregando(true)
        conectorBancoDeDados
        .deletarLancamento(id,faturaId)
        .then(()=> buscarDados())
        .catch((erro)=>{Alert.alert("ERRO","Erro ao deletar lancamento: "+erro)})
    }

    function editarLancamento(id){
        Alert.alert("Editar lançamento","Aqui vai aparecer o modal de edição deste lançamento cujo id é "+id);
    }

    //CRUD FATURA
    function novaFatura(){
        conectorBancoDeDados.inserirFatura({dataPagamento: new Date(2028,8,10), contaPagamento:"Banco do Brasil", estaPaga: true})
        .then(()=>{
            setCarregando(true)
            Alert.alert("Sucesso!","Fatura criada com sucesso!")
            buscarDados();
        })
        .catch((erro)=>{Alert.alert("ERRO","Erro ao adicionar Fatura: "+erro)})
    }

    function deleteFatura(id){
        Alert.alert(
            "Exclusão de Fatura",
            "Tem certeza que esta fatura?",[
                {
                    text:"Cancelar"
                },
                {
                    text:"Excluir",
                    onPress: ()=> {
                        setCarregando(true)
                        conectorBancoDeDados.deletarFatura(id)
                        .then (()=>{buscarDados();})
                        .catch((erro)=>{Alert.alert("ERRO","Erro ao Excluir lancamento: "+erro)});
                    }
                }
            ]
        );        
    }    

    function buscarDados(){
        conectorBancoDeDados
        .getFaturas()
        .then( faturas => {
            setFaturas(faturas);
            setCarregando(false);
        })
        .catch(e => {
            Alert.alert("ERRO","Erro ao buscar fatura:"+e)
        });

        return ()=>{};
    }

    if(carregando){      

        return <PaginaCarregando/>;

    }else{
        
        return (
            <View style={estilo.principal}>
                <Text style={{fontSize: 24, textAlign: "center", margin: 4}} >Faturas</Text>

                <View >
                    <TouchableOpacity onPress={novaFatura} style={{backgroundColor: "red"}}>
                            <Text style={{fontSize: 20, textAlign: "center", margin: 10}}>Nova Fatura</Text>
                    </TouchableOpacity>
                </View>
                
                <SafeAreaView style={{backgroundColor: "blue",flex:1}}>
                    <Text style={{fontSize: 16, textAlign: "center"}}>resultados: {faturas.length}</Text>

                    <FlatList
                        data={faturas}
                        renderItem={(fatura) => 
                        <Fatura 
                            fatura={fatura.item} 
                            deleteFatura={deleteFatura} 
                            novoLancamento={novoLancamento}
                            deletarLancamento={deletarLancamento}
                            editarLancamento={editarLancamento}
                            />
                        }
                    />
                </SafeAreaView>
            </View>
        )  
        
    }    
}

const estilo = StyleSheet.create({
    principal:{
        flex:1,
        display: "flex",        
        backgroundColor: "#4d2e2eff",
        },
    novaFatura:{
        flex: 1,
        padding: 12,                
        alignItems: "center",
        backgroundColor: "rgb(61, 168, 29)",
    },
    Subtitulo: {
        fontSize: 16,
        color: "white",
        textAlign: 'center'
    },
    AreaTransacoes:{
        flex: 1, 
        backgroundColor: "#221122" 
    }
});

export default PaginaFatura;