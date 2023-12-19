import { useAccount, useConnect, useDisconnect } from "wagmi"

const ConnectWallet = () => {

  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { address } = useAccount()

  return <div>

    {address && <div>
      <div>{address}</div>
      <button onClick={() => disconnect()}>logout</button>
    </div>}
    {
      connectors.map((connector, index) => {

        return <button key={index} className=" p-2 m-4" onClick={() => connect({ connector })}>
          {connector.name}
        </button>
      })
    }
  </div>
}

export default ConnectWallet