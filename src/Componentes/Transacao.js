import { View,Text } from "react-native"

//EXIBE AS INFORMAÇÕES SOBRE A TRANSAÇÃO
const Transacao = ({transacao})=>{

    let dataEmDate = transacao.data.toDate();
    let d = ("0"+dataEmDate.getDay()).slice(-2) + "/" + ("0"+(dataEmDate.getMonth()+1)).slice(-2) + "/" + dataEmDate.getFullYear();
    let c = transacao.conta._documentPath._parts[3];
    
    return(
    <View style={{flex:1,backgroundColor:'red', margin:16}}>
        <Text>Transação: {transacao.id}</Text>
        <Text>Categoria {transacao.categoria}</Text>
        <Text>Data: {d}</Text>
        <Text>Conta: {c}</Text>
        <Text>Valor: {transacao.valor}</Text>
    </View>
    )
}

export default Transacao;