import { View,Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import {inteiroParaReal} from "./CampoDinheiro";
import { useNavigation } from '@react-navigation/native';

//EXIBE AS INFORMAÇÕES SOBRE A TRANSAÇÃO

//const navegador = useNavigation();

const Transacao = ({transacao, excluirTransacao})=>{

    const navegador = useNavigation();

    const ConfirmarExcluirTransacao = ()=>{
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

    return(
    <View style={{flexDirection: 'row',backgroundColor:(transacao.valor<0 ? "#660b0bff" :'#085221ff'), margin:8}}>

        <View style={{flex: 8,flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{flexDirection: "column"}}>
                <Text style={{fontSize:20}}>{transacao.conta} </Text>
                <Text style={{fontSize:20}}>{transacao.categoria} </Text>
            </View>
            <Text style={{fontSize:20}}>{inteiroParaReal(transacao.valor)}</Text>
        </View>
        
        <View style={{flex: 1,flexDirection:'column'}}>
            <TouchableOpacity 
                style={estilo.botaoExcluir} 
                onPress={()=>{ConfirmarExcluirTransacao();}}
            >
                <Text style={{fontSize:15,color:"white"}}>❌️</Text>
            </TouchableOpacity>

            <TouchableOpacity style={estilo.botaoEditar} 
                                onPress={ ()=>{navegador.navigate("PaginaEditarTransacao",{id:transacao.id})} }>
                <Text style={{fontSize:15,color:"black"}}>📝️</Text>
            </TouchableOpacity>
        </View>

    </View>
    )
}

let estilo = StyleSheet.create({
    Texto:{
        fontSize: 15,
        color:"black",
    },
    Quadro: {  
        flex:1,
        margin:5,
        backgroundColor: "#CCCC00",
        borderColor:"black",
        borderStyle:"solid",
        borderWidth:2,
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
    }

    });

export default Transacao;