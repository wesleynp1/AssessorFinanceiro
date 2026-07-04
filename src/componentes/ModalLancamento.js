import React from 'react';
import { useState, useRef } from "react";
import { View, Text, Alert, TouchableOpacity, StyleSheet, Modal, TextInput, Button, ActivityIndicator } from "react-native";
import conectorBancoDeDados from '../controladores/conectorBancoDeDados';
import {CampoData2} from "./CampoData";
import CampoDinheiro from "../componentes/CampoDinheiro";
import { valoresDefaultLancamento } from './paginas/PaginaFaturas';

function ModalLancamento({fecharModal, visivel, faturaId, buscarDados, lancamento}){

    const [valor,setValor] = useState(Math.abs(lancamento.valor));
    const [categoria,setCategoria] = useState(lancamento.categoria);
    const [data,setData] = useState(lancamento.data);
    const [carregando,setCarregando] = useState(false);
    const [id,setId] = useState((lancamento.id ? lancamento.id : null));

    const refCampoCategoria = useRef();
    const refCampoDinheiro = useRef();


    function atualizaStates(LancamentoReferencia){
            setValor(LancamentoReferencia.valor);
            setCategoria(LancamentoReferencia.categoria);
            setData(LancamentoReferencia.data);
            setId(LancamentoReferencia.id);
    }

    //Quando fechar o Modal as informações são apagadas
    if(!visivel && id != valoresDefaultLancamento.id)atualizaStates(valoresDefaultLancamento);
    if(visivel && id != lancamento.id)atualizaStates(lancamento);

    function aoSubmeter(){
        //Se lancamento tem id então já existe portanto é uma atualização
        if(lancamento.id){
            setCarregando(true);
            conectorBancoDeDados
            .editarLancamento({valor: valor, categoria:categoria, data:data, id:lancamento.id},faturaId)
            .then(()=>{ 
                buscarDados();
                Alert.alert("Lançamento atualizado!");
            })
            .catch((e)=>{
                Alert.alert("Erro","O que houve:"+e);
                setCarregando(false); 
            })
        }else{//Senão é novo
            setCarregando(true)
            conectorBancoDeDados
            .inserirLancamento({valor: valor, categoria:categoria, data:data},faturaId)
            .then(()=> {
                buscarDados();
                Alert.alert("Lançamento adicionado!")
            })
            .catch((erro)=>{
                Alert.alert("Erro","O que houve:"+e);
                setCarregando(false); 
            })
        }        
    }

    const estilo = StyleSheet.create({
        Titulo:{
            fontSize: 24,        
            textAlign:'center',
            marginBottom: 16
        },
        Modal:{
            flex: 1,
            backgroundColor:'#000000b4',
            justifyContent: "center"
        },
        Formulario: {
            backgroundColor: 'rgba(59, 59, 59, 0.96)',
            alignSelf: 'center',
            paddingLeft: 32,
            paddingRight: 32,
            paddingBottom: 32,
            borderWidth: 1,
            borderColor: "#FFF",
            borderRadius: 16,
        },
        CampoDinheiro: {
            backgroundColor: "gray", 
            alignSelf:'center',
            textAlign:'center',
            marginBottom: 4
        },
        Picker: {
            width:180,
            alignSelf:"center",
            backgroundColor:'#808000',
            marginBottom: 4
        },
        BotaoFechar:{
            fontSize: 24,        
            textAlign: "right",
            marginRight: 48,
            marginBottom: 4
        },
        campos:{
            fontSize: 12,
            color:"white",
            textAlign:"center",
            borderColor:"blue",
            borderStyle:"solid",
            borderWidth:2,
            margin:10,
            padding: 2
        },
        BotaoAtualizar:{   
            alignItems:"center",
            padding: 12,
            backgroundColor:"#0b7c8b",
            marginBottom: 16,
            marginTop: 16
        }
    });

    if(carregando){
        return <Modal 
                    animationType="fade"
                    visible={visivel}
                    transparent={true}
                    onRequestClose={fecharModal}                    
                    >
                    <ActivityIndicator size={"large"}/>
                </Modal>
    }else{

        
    
        return (<Modal 
                    animationType="fade"
                    visible={visivel}
                    transparent={true}
                    onRequestClose={fecharModal}
                    onShow={()=>refCampoCategoria.current.focus()}
                    >
                        <View style={estilo.Modal}>
                            <Text style={estilo.BotaoFechar} onPress={fecharModal}>X</Text>
                            <View style={estilo.Formulario}>
                                <Text style={estilo.Titulo}>Edite as informações do lancamento</Text>

                                <TextInput  
                                    style={estilo.campos}
                                    placeholderTextColor="gray"
                                    value={categoria}
                                    placeholder="Categoria"
                                    onChangeText={setCategoria}
                                    onSubmitEditing={()=> {refCampoDinheiro.current.focus()}}
                                    ref={refCampoCategoria}
                                />

                                <CampoDinheiro
                                    estilo={estilo.campos}
                                    valorInicial={valor}
                                    aoMudarTexto={setValor}
                                    negativo={true}
                                    referencia={refCampoDinheiro}
                                />

                                <CampoData2 estilo={estilo.campos}
                                                    valorInicial={data}
                                                    aoMudarTexto={setData}
                                                   />
                                
                                <TouchableOpacity 
                                    style={estilo.BotaoAtualizar} 
                                    onPress={aoSubmeter}
                                    >
                                    <Text>ADICIONAR</Text>
                                </TouchableOpacity>

                                <Button 
                                    title="Cancelar" 
                                    color={"#AA0000"}
                                    onPress={fecharModal}
                                    />
                            </View>
                        </View>
                    </Modal>
                );
    }
}

export default ModalLancamento;