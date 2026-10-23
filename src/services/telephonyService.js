// Real Telephony Outbound Voice Calling Service (Bland AI & Cellular Gateway)

export async function makeRealCellularCall(phoneNumber, promptTask, apiKey = '') {
  // Clean phone number with international format (+91 for India if 10 digits)
  let cleanNumber = phoneNumber.replace(/\D/g, '');
  if (cleanNumber.length === 10) {
    cleanNumber = `+91${cleanNumber}`;
  } else if (!cleanNumber.startsWith('+')) {
    cleanNumber = `+${cleanNumber}`;
  }

  // Get token from parameter, localStorage, or fallback
  const token = (apiKey || localStorage.getItem('ai_dialer_bland_key') || 'org_1447689266').trim();

  try {
    const res = await fetch('https://api.bland.ai/v1/calls', {
      method: 'POST',
      headers: {
        'authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone_number: cleanNumber,
        task: promptTask || 'You are an autonomous AI Receptionist and caller calling on behalf of a clinic or store. Converse politely in natural Telugu or English as preferred by the receiver.',
        voice: 'maya',
        reduce_latency: true,
        record: true,
        max_duration: 5,
        model: 'enhanced'
      })
    });

    const data = await res.json();
    
    // Check Bland.ai response structure
    if (res.ok && (data.status === 'success' || data.call_id)) {
      return { 
        status: 'success', 
        callId: data.call_id, 
        message: 'మీ మొబైల్ నంబర్‌కు కాల్ విజయవంతంగా పంపబడింది! కాసేపట్లో మీ ఫోన్ రింగ్ అవుతుంది.', 
        data 
      };
    } else {
      const errMsg = (data.errors && data.errors[0]?.message) || data.message || 'Call failed to dispatch';
      return { 
        status: 'error', 
        message: errMsg, 
        isAuthFailure: errMsg.toLowerCase().includes('unauthorized') || (data.errors && data.errors[0]?.error === 'AUTH_FAILURE'),
        data 
      };
    }
  } catch (err) {
    console.warn('Real Telephony API network error:', err);
    return { 
      status: 'error', 
      message: `నెట్‌వర్క్ సమస్య లేదా API కనెక్షన్ ఎర్రర్: ${err.message}` 
    };
  }
}
