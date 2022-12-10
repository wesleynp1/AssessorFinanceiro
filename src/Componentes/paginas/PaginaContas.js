import { View,Text,SafeAreaView, FlatList, StyleSheet } from "react-native";
import {inteiroParaReal} from "../CampoDinheiro"

const PaginaContas = ({contas})=>{

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
            <Text style={{color:'#000000',textAlign:'center'}}>CONTAS</Text>

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
        }
    });