const $prompt = document.getElementById('prompt');
const $btn = document.getElementById('btnSend');
const $chat = document.getElementById('chatBox');
const $status = document.getElementById('status');

const defaultPrompt = `
คุณคือผู้ช่วย AI ของโรงพยาบาล "AI CARE"
ข้อมูลปัจจุบันของโรงพยาบาลมีดังนี้:
- ประเภท: โรงพยาบาลเอกชน
- เวลาทำการ: เปิดบริการ 24 ชั่วโมง
- โทร: 1719
- หน้าที่ของ AI: ตอบคำถามด้านสุขภาพ, การแพทย์, การดูแลผู้ป่วย
หากมีคำถามอื่นที่ไม่เกี่ยวกับการแพทย์ ให้ตอบว่า "ไม่ทราบ" หรือ "ไม่มีข้อมูล"
`;

function addMessage(role, text) {
  const div = document.createElement('div');
  div.className = `bubble ${role}`;
  div.textContent = text;
  $chat.appendChild(div);
  $chat.scrollTop = $chat.scrollHeight;
  return div;
}

function addTypingIndicator() {
  const div = document.createElement('div');
  div.className = 'bubble ai';
  div.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
  $chat.appendChild(div);
  $chat.scrollTop = $chat.scrollHeight;
  return div;
}

async function typeWriter(element, text, speed = 30) {
  element.textContent = '';
  for (let i = 0; i < text.length; i++) {
    element.textContent += text.charAt(i);
    $chat.scrollTop = $chat.scrollHeight;
    await new Promise(r => setTimeout(r, speed));
  }
}

async function sendMessage() {
  const text = $prompt.value.trim();
  if (!text) return;

  addMessage('user', text);
  $prompt.value = '';
  $btn.disabled = true;
  $status.textContent = 'กำลังคิด...';
  $status.classList.add('loading');

  const typingIndicator = addTypingIndicator();
  const fullPrompt = defaultPrompt + text;

  try {
    const res = await fetch('/api/ai.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: fullPrompt }]
      })
    });

    if (!res.ok) {
      const t = await res.text();
      throw new Error(t || `HTTP ${res.status}`);
    }

    const data = await res.json();

    typingIndicator.remove();
    const bubble = addMessage('ai', '');
    await typeWriter(bubble, data.content ?? '(ไม่มีข้อความตอบกลับ)');
  } catch (err) {
    typingIndicator.remove();
    addMessage('ai', 'เกิดข้อผิดพลาด: ' + err.message);
  } finally {
    $btn.disabled = false;
    $status.textContent = '';
    $status.classList.remove('loading');
  }
}

$btn.addEventListener('click', sendMessage);
$prompt.addEventListener('keypress', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
