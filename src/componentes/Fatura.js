import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { dateParaTexto } from "./CampoData";
import { AreaTransacoes } from "./paginas/PaginaTransacoes";
import { inteiroParaReal } from './CampoDinheiro';

function Fatura({fatura, deleteFatura, novoLancamento, deletarLancamento, editarLancamento, reverterPagarFatura, pagarFatura}){

    function totalFatura(){
        let totalFatura = 0;

        for(lancamento of fatura.lancamentos){
            totalFatura += lancamento.valor;
        }

        return totalFatura;
    }

    const estilo = StyleSheet.create({
        fatura:{
            backgroundColor: "black",
            marginBottom: 32,  
            marginLeft:  4,          
            marginRight: 4,
            borderColor: "white",
            borderStyle: "solid",
            borderWidth: 1,
            borderRadius: 8,
            padding:4
        },
        cabeçalho:{
            flexDirection: "row-reverse",
            backgroundColor:"black",
            color:"white",
            padding:4,
            borderColor: "white",
            borderStyle: "solid",
            borderWidth: 1,
        },
        botaoNovoLancamento:{
            flexDirection:"column",
            justifyContent: "center",
            backgroundColor: "#c06d29",
            borderColor: "white",
            borderStyle: "solid",
            borderWidth: 1,            
        },
        botaoExcluir:{
            flex:1, 
            flexDirection:"column",
            justifyContent: "center",
            backgroundColor: "#ff0000",
        },
        botaoExcluirTexto:{
            fontSize: 20, 
            textAlign: "center", 
            margin: 10
        },
        containerPagamento:{
            flex:1,
            flexDirection:"row",
            justifyContent:"space-around", 
            alignItems:"center"
        },
        statusPagamento:{
            padding:10,
            textAlign:"center",
            backgroundColor: fatura.estaPaga ? "green" : "blue",
            borderRadius: 8
        },
        pequenaMensagem:{
            textAlign:"center",
            fontSize: 8,
        },
        ValorPagamento:{
            fontSize: 28,
        },
        botaoNovoLancamentoTexto:{
            textAlign:"center",
            fontSize: 16,
            padding: 8
        }
    });    

    return (
        <View style={estilo.fatura}>
            <View style={estilo.cabeçalho}>
                <View>      
                    <TouchableOpacity onPress={()=>{deleteFatura(fatura.id)}} style={estilo.botaoExcluir}>
                                    <Text style={estilo.botaoExcluirTexto}>✖️</Text>
                    </TouchableOpacity>          
                </View>    

                <View style={estilo.containerPagamento}>
                    <Text style={estilo.ValorPagamento}>{inteiroParaReal(totalFatura())}</Text>
                    <TouchableOpacity onPress={fatura.estaPaga ? reverterPagarFatura : pagarFatura}>
                        <Text style={estilo.pequenaMensagem}>{fatura.estaPaga ? "Pago em "+ dateParaTexto(fatura.dataPagamento) : "Toque para pagar"}</Text>
                        <Text style={estilo.statusPagamento}>{fatura.estaPaga ? "Pago" : "Não Pago"}</Text>
                    </TouchableOpacity>
                </View>          
            </View>

            {!fatura.estaPaga ?
            <View>      
                <TouchableOpacity onPress={()=>{novoLancamento(fatura.id)}} style={estilo.botaoNovoLancamento}>
                                <Text style={estilo.botaoNovoLancamentoTexto}>+ Novo Lancamento</Text>
                </TouchableOpacity>          
            </View>
            :
            <View></View>
            }

            <View>
                {
                fatura?.lancamentos && 
                    <AreaTransacoes 
                    titulo="Lançamentos" 
                    transacoes={fatura.lancamentos} 
                    excluirTransacao={lancamentoId => deletarLancamento(lancamentoId,fatura.id)} 
                    editarTransacao={lancamentoId => editarLancamento(fatura.id,lancamentoId)}
                    alteraveis={!fatura.estaPaga}
                    />
                }
            </View>
        </View>
    )
}

export default Fatura;