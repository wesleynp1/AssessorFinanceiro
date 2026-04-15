import React from 'react';
import { View,Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import {inteiroParaReal} from "./CampoDinheiro";
import { useNavigation } from '@react-navigation/native';

//EXIBE AS INFORMAÇÕES SOBRE A TRANSAÇÃO

/**
 * @param transacao : {conta : string , categoria : string, valor : number, data : Date}
 */

const Transacao = ({transacao, excluirTransacao, editarTransacao})=>{

    const navegador = useNavigation();

    const estilo = StyleSheet.create({   
        transacao:{
            flexDirection: 'row',
            backgroundColor:(transacao.valor<0 ? "#660b0bff" :'#085221ff'), 
            margin:4
        },
        texto:{
            fontSize:20,
            textAlign:"center"
        } ,
        grupoBotoes:{
            flex: 1,
            flexDirection:'column'
        },
        botaoExcluir:{
            flex:1, 
            backgroundColor:'#c01515ff',        
            alignItems:'center'
        },
        botaoEditar:{
            flex:1, 
            backgroundColor:'#089108ff',
            alignItems:'center'
        },
        TextoBotoes:{
            fontSize:15,
            color:"white"
        },
        banco:{
            flex:1,
            justifyContent:"space-around", 
            borderRightColor: "white", 
            borderRightWidth: 1,            
        },
        categoria:{
            flex:1,
            justifyContent:"space-around",
            borderRightColor: "white", 
            borderRightWidth: 1,
            backgroundColor:"rgba(0, 0, 0, 0.18)"
        },
        valor:{
            flex:1,
            justifyContent:"space-around",
            backgroundColor:"rgba(0, 0, 0, 0.36)"
        }
    });

    function ConfirmarExcluirTransacao(){
            Alert.alert(
                "Exclusão de Transação",
                "Tem certeza que deseja excluir esta transação da categoria " + 
                transacao.categoria + "?",
                [
                    {
                        text:"Cancelar"
                    },
                    {
                        text:"Excluir",
                        onPress: ()=>{excluirTransacao(transacao.id)}
                    }
                ]
                );
    }

    function editarTransancao(){
        if(editarTransacao){
            editarTransacao(transacao.id)
        }else{
            navegador.navigate("PaginaEditarTransacao",{id:transacao.id})
        }        
    }

    return(
    <View style={estilo.transacao}>

        <View style={{flex: 8,flexDirection: 'row', justifyContent: 'space-between' }}>
            {transacao?.conta && 
            <View style={estilo.banco}>
                 <Text style={estilo.texto}>{transacao.conta} </Text>                
            </View>
            }

            <View style={estilo.categoria}>
                <Text style={estilo.texto}>{transacao.categoria} </Text>
            </View>

            <View style={estilo.valor}>
                <Text style={estilo.texto}>{inteiroParaReal(transacao.valor)}</Text>
            </View>
        </View>
        
        <View style={estilo.grupoBotoes}>
            <TouchableOpacity 
                style={estilo.botaoExcluir} 
                onPress={ConfirmarExcluirTransacao}
            >
                <Text style={{fontSize:15,color:"white"}}>❌️</Text>
            </TouchableOpacity>
                        
            <TouchableOpacity style={estilo.botaoEditar} 
                                onPress={editarTransancao}>
                <Text style={estilo.TextoBotoes}>📝️</Text>
            </TouchableOpacity>            
        </View>

    </View>
    )
}


export default Transacao;