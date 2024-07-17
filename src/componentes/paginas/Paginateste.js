import firestore from '@react-native-firebase/firestore';
import { View,Text} from 'react-native';
import { useState } from 'react';

const Paginateste = () => {

  const [informacao,setInformacao] = useState("sem informação");

  firestore()
  .collection("usuarios")
  .doc("wesleynp")
  .collection("contas")
  .doc("carteira")
  .get()
  .then(qs=>{
    alert(qs.ref);
    setInformacao(qs.data());
  })
  .catch(r=>{console.log(r)});

  return(
    <View style={{flex:1,justifyContent:"center", alignItems:"center"}}>
      <Text>TESTE</Text>
      
      <Text>Teste pois o app parou</Text>
      <Text>{informacao}</Text>
    </View>
  )
}

  export default Paginateste