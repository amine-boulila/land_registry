'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import Navbar from '../../components/Navbar';
import { LAND_REGISTRY_ABI } from '../../utils/abi';
import { LAND_REGISTRY_ADDRESS } from '../../utils/contracts';

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('marketplace');
  const [isAdmin, setIsAdmin] = useState(false);

  // Form states
  const [registerForm, setRegisterForm] = useState({
    owner: '',
    location: '',
    size: '',
    value: ''
  });
  const [listForm, setListForm] = useState({ landId: '', price: '' });
  const [transferForm, setTransferForm] = useState({ landId: '', newOwner: '' });
  const [unlistLandId, setUnlistLandId] = useState('');

  // Read admin address
  const { data: adminAddress } = useReadContract({
    address: LAND_REGISTRY_ADDRESS,
    abi: LAND_REGISTRY_ABI,
    functionName: 'admin',
  });

  // Get lands for sale (NEW EFFICIENT METHOD!)
  const { data: landsForSaleIds, refetch: refetchMarketplace } = useReadContract({
    address: LAND_REGISTRY_ADDRESS,
    abi: LAND_REGISTRY_ABI,
    functionName: 'getLandsForSale',
  });

  // Get user's lands (NEW EFFICIENT METHOD!)
  const { data: myLandIds, refetch: refetchMyLands } = useReadContract({
    address: LAND_REGISTRY_ADDRESS,
    abi: LAND_REGISTRY_ABI,
    functionName: 'getLandsByOwner',
    args: address ? [address] : undefined,
  });

  // Batch fetch marketplace lands
  const { data: marketplaceLands } = useReadContract({
    address: LAND_REGISTRY_ADDRESS,
    abi: LAND_REGISTRY_ABI,
    functionName: 'getLands',
    args: landsForSaleIds && landsForSaleIds.length > 0 ? [landsForSaleIds] : undefined,
  });

  // Batch fetch user's lands
  const { data: myLands } = useReadContract({
    address: LAND_REGISTRY_ADDRESS,
    abi: LAND_REGISTRY_ABI,
    functionName: 'getLands',
    args: myLandIds && myLandIds.length > 0 ? [myLandIds] : undefined,
  });

  // Write contract hook
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Check if user is admin
  useEffect(() => {
    if (address && adminAddress) {
      setIsAdmin(address.toLowerCase() === adminAddress.toLowerCase());
    }
  }, [address, adminAddress]);

  // Refetch data after transaction confirms
  useEffect(() => {
    if (isConfirmed) {
      refetchMarketplace();
      refetchMyLands();
    }
  }, [isConfirmed, refetchMarketplace, refetchMyLands]);

  // Register Land
  const handleRegisterLand = () => {
    writeContract({
      address: LAND_REGISTRY_ADDRESS,
      abi: LAND_REGISTRY_ABI,
      functionName: 'registerLand',
      args: [
        registerForm.owner,
        registerForm.location,
        BigInt(registerForm.size),
        parseEther(registerForm.value)
      ],
    });
  };

  // List Land
  const handleListLand = () => {
    writeContract({
      address: LAND_REGISTRY_ADDRESS,
      abi: LAND_REGISTRY_ABI,
      functionName: 'listLand',
      args: [BigInt(listForm.landId), parseEther(listForm.price)],
    });
  };

  // Unlist Land (NEW!)
  const handleUnlistLand = () => {
    writeContract({
      address: LAND_REGISTRY_ADDRESS,
      abi: LAND_REGISTRY_ABI,
      functionName: 'unlistLand',
      args: [BigInt(unlistLandId)],
    });
  };

  // Buy Land
  const handleBuyLand = (landId, price) => {
    writeContract({
      address: LAND_REGISTRY_ADDRESS,
      abi: LAND_REGISTRY_ABI,
      functionName: 'buyLand',
      args: [BigInt(landId)],
      value: price,
    });
  };

  // Transfer Ownership
  const handleTransferOwnership = () => {
    writeContract({
      address: LAND_REGISTRY_ADDRESS,
      abi: LAND_REGISTRY_ABI,
      functionName: 'transferOwnership',
      args: [BigInt(transferForm.landId), transferForm.newOwner],
    });
  };

  if (!isConnected) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '48px' }}>
            <h2 style={{ marginBottom: '16px' }}>Connect Your Wallet</h2>
            <p>Please connect your wallet to access the dashboard</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '40px' }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '32px' }}>Dashboard</h1>

          {/* Admin Panel */}
          {isAdmin && (
            <div className="glass-panel" style={{ marginBottom: '32px' }}>
              <h2 style={{ color: '#7b3fe4', marginBottom: '24px' }}>🔐 Admin Panel</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <input
                  type="text"
                  placeholder="Owner Address"
                  value={registerForm.owner}
                  onChange={(e) => setRegisterForm({ ...registerForm, owner: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={registerForm.location}
                  onChange={(e) => setRegisterForm({ ...registerForm, location: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
                <input
                  type="number"
                  placeholder="Size (sq m)"
                  value={registerForm.size}
                  onChange={(e) => setRegisterForm({ ...registerForm, size: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
                <input
                  type="text"
                  placeholder="Value (ETH)"
                  value={registerForm.value}
                  onChange={(e) => setRegisterForm({ ...registerForm, value: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>
              <button
                onClick={handleRegisterLand}
                disabled={isPending || isConfirming}
                className="glass-button"
                style={{ marginTop: '16px', width: '100%' }}
              >
                {isPending || isConfirming ? 'Registering...' : 'Register Land'}
              </button>
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {['marketplace', 'mylands', 'manage'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="glass-button"
                style={{
                  background: activeTab === tab ? 'var(--primary)' : 'transparent',
                  border: activeTab === tab ? 'none' : '1px solid rgba(255,255,255,0.2)'
                }}
              >
                {tab === 'marketplace' ? '🏪 Marketplace' : tab === 'mylands' ? '🏠 My Lands' : '⚙️ Manage'}
              </button>
            ))}
          </div>

          {/* Content based on active tab */}
          {activeTab === 'marketplace' && (
            <div>
              <h2 style={{ marginBottom: '24px' }}>Lands for Sale</h2>
              {!marketplaceLands || marketplaceLands.length === 0 ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '48px' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No lands currently for sale. Check back later!</p>
                </div>
              ) : (
                <div className="grid-cols-3">
                  {marketplaceLands.map((land) => (
                    <LandCard 
                      key={land.landId.toString()} 
                      land={land} 
                      onBuy={() => handleBuyLand(land.landId, land.price)}
                      isPending={isPending || isConfirming}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'mylands' && (
            <div>
              <h2 style={{ marginBottom: '24px' }}>My Properties</h2>
              {!myLands || myLands.length === 0 ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '48px' }}>
                  <p style={{ color: 'var(--text-muted)' }}>You don't own any land yet. Visit the marketplace to buy some!</p>
                </div>
              ) : (
                <div className="grid-cols-3">
                  {myLands.map((land) => (
                    <LandCard 
                      key={land.landId.toString()} 
                      land={land} 
                      isOwned={true}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'manage' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* List Land */}
              <div className="glass-panel">
                <h3 style={{ marginBottom: '16px' }}>📋 List Land for Sale</h3>
                <input
                  type="number"
                  placeholder="Land ID"
                  value={listForm.landId}
                  onChange={(e) => setListForm({ ...listForm, landId: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '100%', marginBottom: '12px' }}
                />
                <input
                  type="text"
                  placeholder="Price (ETH)"
                  value={listForm.price}
                  onChange={(e) => setListForm({ ...listForm, price: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '100%', marginBottom: '12px' }}
                />
                <button onClick={handleListLand} disabled={isPending || isConfirming} className="glass-button" style={{ width: '100%' }}>
                  {isPending || isConfirming ? 'Listing...' : 'List Land'}
                </button>
              </div>

              {/* Unlist Land (NEW!) */}
              <div className="glass-panel">
                <h3 style={{ marginBottom: '16px' }}>❌ Remove from Sale</h3>
                <input
                  type="number"
                  placeholder="Land ID"
                  value={unlistLandId}
                  onChange={(e) => setUnlistLandId(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '100%', marginBottom: '12px' }}
                />
                <button onClick={handleUnlistLand} disabled={isPending || isConfirming} className="glass-button" style={{ width: '100%' }}>
                  {isPending || isConfirming ? 'Unlisting...' : 'Unlist Land'}
                </button>
              </div>

              {/* Transfer Ownership */}
              <div className="glass-panel">
                <h3 style={{ marginBottom: '16px' }}>🔄 Transfer Ownership</h3>
                <input
                  type="number"
                  placeholder="Land ID"
                  value={transferForm.landId}
                  onChange={(e) => setTransferForm({ ...transferForm, landId: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '100%', marginBottom: '12px' }}
                />
                <input
                  type="text"
                  placeholder="New Owner Address"
                  value={transferForm.newOwner}
                  onChange={(e) => setTransferForm({ ...transferForm, newOwner: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '100%', marginBottom: '12px' }}
                />
                <button onClick={handleTransferOwnership} disabled={isPending || isConfirming} className="glass-button" style={{ width: '100%' }}>
                  {isPending || isConfirming ? 'Transferring...' : 'Transfer'}
                </button>
              </div>
            </div>
          )}

          {isConfirmed && (
            <div className="glass-panel" style={{ marginTop: '24px', background: 'rgba(123, 63, 228, 0.2)', border: '1px solid rgba(123, 63, 228, 0.5)' }}>
              ✅ Transaction confirmed! Data will refresh automatically.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Land Card Component
function LandCard({ land, onBuy, isPending, isOwned }) {
  return (
    <div className="glass-panel">
      <div style={{ 
        height: '150px', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        borderRadius: '8px', 
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem'
      }}>
        🏞️
      </div>
      <h3 style={{ marginBottom: '8px' }}>Land #{land.landId.toString()}</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>📍 {land.location}</p>
      <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>📏 {land.size.toString()} m²</p>
      <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>💰 Value: {formatEther(land.value)} ETH</p>
      
      {land.isForSale && !isOwned && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#7b3fe4' }}>
              {formatEther(land.price)} ETH
            </span>
            <button onClick={onBuy} disabled={isPending} className="glass-button">
              {isPending ? 'Buying...' : 'Buy Now'}
            </button>
          </div>
        </>
      )}
      
      {isOwned && (
        <div style={{ 
          marginTop: '16px', 
          padding: '8px', 
          background: 'rgba(123, 63, 228, 0.2)', 
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}>
          {land.isForSale ? '🏷️ Listed for Sale' : '✅ You Own This'}
        </div>
      )}
    </div>
  );
}
