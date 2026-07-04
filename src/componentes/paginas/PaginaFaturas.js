import React from 'react';
import { useState, useEffect } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import conectorBancoDeDados from '../../controladores/conectorBancoDeDados';
import PaginaCarregando from "./PaginaCarregando";
import PaginaPagarFatura from "./PaginaPagarFatura";
import Fatura from '../Fatura';
import ModalLancamento from "../ModalLancamento";
import { createStackNavigator } from '@react-navigation/stack';


export const valoresDefaultLancamento = {valor:0, categoria:"",data: new Date(), id:null};
const STACK= createStackNavigator();


function PaginaFaturas({buscarSaldoTransacoes, nomeContas, categorias}){

    const [carregando,setCarregando] = useState(true);
    const [faturas,setFaturas] = useState([]);

    //CONTROLE MODAL - O que está sendo visto e editado
    const [modalFormularioLancamentoVisible,setModalFormularioLancamentoVisible] = useState(false);
    const [faturaEmEdicaoId,setFaturaEmEdicaoId] = useState(null);
    const [lancamentoEmEdicao,setlancamentoEmEdicao] = useState(valoresDefaultLancamento);


    useEffect(buscarDados,[]);

    //CRUD LANCAMENTO
    function novoLancamento(faturaId){
        setlancamentoEmEdicao(valoresDefaultLancamento);
        setFaturaEmEdicaoId(faturaId);
        setModalFormularioLancamentoVisible(true);
    }

    function editarLancamento(faturaId,LancamentoId){
        let fatura = faturas.find(f => f.id == faturaId);
        let lancamento = fatura.lancamentos.find(l => l.id == LancamentoId);
        
        setlancamentoEmEdicao(lancamento);
        setFaturaEmEdicaoId(faturaId);
        setModalFormularioLancamentoVisible(true);
    }

    function deletarLancamento(id,faturaId){
        setCarregando(true)
        conectorBancoDeDados
        .deletarLancamento(id,faturaId)
        .then(()=> buscarDados())
        .catch((erro)=>{Alert.alert("ERRO","Erro ao deletar lancamento: "+erro)})
    }

    //CRUD FATURA
    function novaFatura(){
        conectorBancoDeDados.inserirFatura({estaPaga: false})
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
        if(!carregando)setCarregando(true);
        if(modalFormularioLancamentoVisible)setModalFormularioLancamentoVisible(false);

        conectorBancoDeDados
        .getFaturas()
        .then( faturas => {
            setFaturas(faturas);
            setCarregando(false);
        })
        .catch(e => {
            Alert.alert("ERRO","Erro ao buscar faturas:"+e)            
        });
    }   

    function reverterPagarFatura(fatura){
        Alert.alert("Em breve","Ainda não implementado");
    }

    //PAGINA FATURAS
    function RenderPaginaFaturas({navigation}){
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
                        renderItem={(fatura) =>{
                                return( 
                                <Fatura 
                                    pagarFatura={()=>{ navigation.navigate('pagar fatura',{faturaId: fatura.item.id}) }}
                                    reverterPagarFatura={()=>reverterPagarFatura()}
                                    fatura={fatura.item} 
                                    deleteFatura={deleteFatura} 
                                    novoLancamento={novoLancamento}
                                    deletarLancamento={deletarLancamento}
                                    editarLancamento={editarLancamento}
                                    />
                            );
                        }
                        }
                    />
                </SafeAreaView>                
                
                <ModalLancamento
                    buscarDados={buscarDados}
                    lancamento={lancamentoEmEdicao}
                    faturaId={faturaEmEdicaoId}
                    visivel={modalFormularioLancamentoVisible}
                    fecharModal={()=>setModalFormularioLancamentoVisible(false)}
                    categorias={categorias}
                />
            </View>    
        );
    }

    function RenderPaginaPagarFatura({ route }){  
        
        
        return (
            <PaginaPagarFatura 
                contas={nomeContas} 
                fatura={faturas.find(f=>f.id==route.params.faturaId)}
                buscarSaldoTransacoes={buscarSaldoTransacoes}
                />
        );
    }

    if(carregando || faturas==undefined){      

        return <PaginaCarregando/>;

    }else{
        return (
            <STACK.Navigator initialRouteName='faturas' screenOptions={{ headerShown: false }}>
                <STACK.Screen name='faturas'        component={RenderPaginaFaturas}/>
                <STACK.Screen name='pagar fatura'   component={RenderPaginaPagarFatura}/>
            </STACK.Navigator>
        );          
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

export default PaginaFaturas;