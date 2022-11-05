import { View,Text } from "react-native"

const Transacao = ({categoria,conta,data,valor})=>{

    let d = "?";
    let c = "?";

    if(data!=undefined)
    { 
        let dataEmDate = data.toDate();
        d = ("0"+dataEmDate.getDay()).slice(-2) + "/" + ("0"+(dataEmDate.getMonth()+1)).slice(-2) + "/" + dataEmDate.getFullYear();
    }

    

    if(conta!=undefined)c = conta._documentPath._parts[3];
    
    return(
    <View style={{flex:1,backgroundColor:'red', margin:16}}>
        <Text>Transação</Text>
        <Text>Categoria {categoria}</Text>
        <Text>Data {d}</Text> 
        <Text>Conta {c}</Text>
        <Text>Valor {valor}</Text>
    </View>
    )
}

export default Transacao;