// source is here: https://stackoverflow.com/questions/58961743/react-native-flatlist-flickers-lazy-loading-additional-data

// not my work...

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

// custom Hook....

// const [{data: people, loading, page}, setPage, setResults] = useRestApi(
//     'https://randomuser.me/api?&seed=ieee',
// );

const useRestApi = (url) => {
  const [data, setPeople] = useState([]);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState(20); // shows 20 items.
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPeople = async () => {
      setLoading(true);

      const response = await fetch(`${url}&page=${page}&results=${results}`);
      const json = await response.json();

      console.log(`json: ${json} for Page: ${page} , results: ${results}`);

      if (page !== 1) {
        setPeople([...data, ...json.results]);
      } else {
        setPeople(json.results);
      }
      setLoading(false);
    };

    fetchPeople();
  }, [page, data, results, url]);

  return [{data, loading, page}, setPage, setResults];
};

const styles = StyleSheet.create({
  listItem: {
    padding: 15,
  },
  listItemHeader: {
    fontSize: 20,
    fontWeight: '500',
  },
  listItemSubHeader: {
    fontSize: 18,
  },
  listItemBody: {
    fontSize: 18,
    color: 'grey',
  },
  listSeparator: {
    height: 1,
    backgroundColor: '#CED0CE',
  },
  listFooter: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#CED0CE',
  },
});

const ListFooterComponent = (
  <View style={styles.listFooter}>
    <ActivityIndicator animating size="large" color="gold" />
  </View>
);

const ItemSeparatorComponent = <View style={styles.listSeparator} />;

export interface Props {
  // name: string;
  // enthusiasmLevel?: number;
}

const App: React.FC<Props> = (props) => {
  // const App = () => {

  const [{data: people, loading, page}, setPage, setResults] = useRestApi(
    'https://randomuser.me/api?&seed=ieee',
  );

  console.log(`data.length:  ${people.length}`);

  // render F... renderF....

  return (
    <>
      {/*<StatusBar barStyle="dark-content" />*/}

      <StatusBar barStyle="light-content" />
      <SafeAreaView
        style={
          {
            // backgroundColor: 'crimson',
          }
        }>
        <FlatList
          data={people}
          onEndReachedThreshold={0.2}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listItemHeader}>
                {item.name.first} {item.name.last}
              </Text>
              <Text style={styles.listItemSubHeader}>
                {item.location.country}
              </Text>
              <Text style={styles.listItemBody}>
                {item.location.street.number} {item.location.street.name}
              </Text>
              <Text style={styles.listItemBody}>
                {item.location.city} {item.location.state}{' '}
                {item.location.postcode}
              </Text>
            </View>
          )}
          refreshing={loading}
          onRefresh={() => {
            setResults(20);
            setPage(1);
          }}
          onEndReached={() => {
            setResults(5);
            setPage(page + 1);
          }}
          ItemSeparatorComponent={() => ItemSeparatorComponent}
          ListFooterComponent={() => (loading ? ListFooterComponent : null)}
        />
      </SafeAreaView>
    </>
  );
};

export default App;
