import Header from '@components/Header'
import { GetStaticPropsContext } from 'next';
import React from 'react'

function Topics() {
    return (
        <div>
            <Header></Header>
            Hello
        </div>
    )
}
export function getStaticProps({ locale }: GetStaticPropsContext) {
    return {
      props: {
        // You can get the messages from anywhere you like, but the recommended
        // pattern is to put them in JSON files separated by language and read
        // the desired one based on the `locale` received from Next.js.
        messages: require(`../lang/locales/${locale}.json`),
      },
    };
  }

export default Topics
