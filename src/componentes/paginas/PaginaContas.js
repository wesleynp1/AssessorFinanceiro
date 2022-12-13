import { View,Text,SafeAreaView, FlatList, StyleSheet } from "react-native";
import {inteiroParaReal} from "../CampoDinheiro";
import estatistica from "../../controladores/estatistica.js";

const PaginaContas = ({contas, transacoes})=>{

    let saldoTotal = 0
    contas.forEach(c =>{saldoTotal+=c.saldo});

    let IniciaConta =  ({item}) => {
        return(
            <View style={estilo.Quadro}>
                <Text style={estilo.Texto}>
                    {item.id} {"\n"}
                    saldo: {inteiroParaReal(item.saldo)} 
                </Text>
            </View>
        )
    }

    return(
        <View style={estilo.Pagina}>
            <Text style={estilo.Titulo}>CONTAS</Text>

            <SafeAreaView>
                <FlatList 
                data={contas} 
                renderItem={IniciaConta}
                />
            </SafeAreaView>

            <Text style={estilo.Texto}> saldo Total: {inteiroParaReal(saldoTotal)}</Text>
        </View>
    );
}

export default PaginaContas;


let estilo = StyleSheet.create({
        Pagina:{
            padding: 16
        },
        Titulo:{
            fontSize: 24,
            color:"black",
            textAlign:'center'
        },  
        Texto:{
            fontSize: 15,
            color:"black",
            textAlign:'center'
        },
        Quadro: {  
            flex:1,
            margin:5,
            backgroundColor: "#AAAACC",
            borderColor:"black",
            borderStyle:"solid",
            borderWidth:2,
        },
    });