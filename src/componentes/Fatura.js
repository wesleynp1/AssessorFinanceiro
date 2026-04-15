import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { dateParaTexto } from "./CampoData";
import { AreaTransacoes } from "./paginas/PaginaTransacoes"

function Fatura({fatura, deleteFatura, novoLancamento, deletarLancamento, editarLancamento}){
    const estilo = StyleSheet.create({
        fatura:{
            backgroundColor: "green",
            marginBottom: 32,  
            marginLeft:  4,          
            marginRight: 4,
        },
        cabeçalho:{
            flexDirection: "row-reverse",
            backgroundColor:"black",
            color:"white",
            marginBottom:10,
            padding:4,
            borderColor: "white",
            borderStyle: "solid",
            borderWidth: 1,
            marginRight: 3,
            marginLeft: 3
        },
        botao:{
            flex:1, 
            flexDirection:"column",
            justifyContent: "center",
            backgroundColor: "#c06d29",
            display:"flex"
        },
        botaoTexto:{
            fontSize: 20, 
            textAlign: "center", 
            margin: 10
        }
    });    

    return (
        <View style={estilo.fatura}>
            <View style={estilo.cabeçalho}>
                <View>      
                    <TouchableOpacity onPress={()=>{deleteFatura(fatura.id)}} style={estilo.botao}>
                                    <Text style={estilo.botaoTexto}>X</Text>
                    </TouchableOpacity>          
                </View>    

                <View style={{flex:1}}>
                    <Text>conta:{fatura.contaPagamento}</Text>
                    <Text>Data pagamento:{dateParaTexto(fatura.dataPagamento)}</Text>
                    { fatura.estaPaga ? <Text>pago</Text> : <Text>Não Pago</Text>}
                </View>          
            </View>

            <View>      
                <TouchableOpacity onPress={()=>{novoLancamento(fatura.id)}} style={estilo.botao}>
                                <Text style={estilo.botaoTexto}>+</Text>
                </TouchableOpacity>          
            </View>

            <View>
                {
                fatura?.lancamentos && 
                    <AreaTransacoes 
                    titulo="Lançamentos" 
                    transacoes={fatura.lancamentos} 
                    excluirTransacao={lancamentoId => deletarLancamento(lancamentoId,fatura.id)} 
                    editarTransacao={editarLancamento}/>
                }
            </View>
        </View>
    )
}

export default Fatura;