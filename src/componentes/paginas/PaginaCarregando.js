import { ActivityIndicator, View,Text} from 'react-native';

const PaginaCarregando = () => {
    return(
      <View style={{flex:1,justifyContent:"center", alignItems:"center"}}>
        <Text>Carregando...</Text>
        <ActivityIndicator size={"large"}/>
        <Text>Só um instante...</Text>
      </View>
    )
  }

  export default PaginaCarregando