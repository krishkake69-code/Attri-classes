const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../src/components/AdminPanel.tsx');
let code = fs.readFileSync(file, 'utf8');

const panels = `
                    {activeTab === 'siteContent' && (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Hero Section</h3>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Headline</label>
                              <input type="text" value={formData.heroContent?.headline || ''} onChange={(e) => setFormData({...formData, heroContent: {...formData.heroContent, headline: e.target.value}})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm outline-none focus:border-blue-500" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Subheadline</label>
                              <textarea value={formData.heroContent?.subheadline || ''} onChange={(e) => setFormData({...formData, heroContent: {...formData.heroContent, subheadline: e.target.value}})} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm outline-none focus:border-blue-500" />
                            </div>
                          </div>
                        </div>
                        <hr className="border-slate-100 dark:border-slate-800" />
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">About Section</h3>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Heading</label>
                              <input type="text" value={formData.aboutContent?.heading || ''} onChange={(e) => setFormData({...formData, aboutContent: {...formData.aboutContent, heading: e.target.value}})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm outline-none focus:border-blue-500" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Paragraph 1</label>
                              <textarea value={formData.aboutContent?.paragraph1 || ''} onChange={(e) => setFormData({...formData, aboutContent: {...formData.aboutContent, paragraph1: e.target.value}})} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm outline-none focus:border-blue-500" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Paragraph 2</label>
                              <textarea value={formData.aboutContent?.paragraph2 || ''} onChange={(e) => setFormData({...formData, aboutContent: {...formData.aboutContent, paragraph2: e.target.value}})} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm outline-none focus:border-blue-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'batches' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Batch Schedule</h3>
                          <button onClick={() => setFormData({...formData, batches: [...(formData.batches || []), { id: 'batch-'+Date.now(), batch: '', audience: '', days: '', time: '', seatsLeft: 0, seatsTotal: 20, mode: '' }]})} className="px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800">Add Batch</button>
                        </div>
                        <div className="space-y-4">
                          {(formData.batches || []).map((batch, index) => (
                            <div key={index} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 relative group">
                              <button onClick={() => setFormData({...formData, batches: formData.batches.filter((_, i) => i !== index)})} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                              <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs mb-1">Batch Name</label><input type="text" value={batch.batch} onChange={(e) => {const newB = [...formData.batches]; newB[index].batch = e.target.value; setFormData({...formData, batches: newB})}} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm outline-none focus:border-blue-500" /></div>
                                <div><label className="block text-xs mb-1">Audience</label><input type="text" value={batch.audience} onChange={(e) => {const newB = [...formData.batches]; newB[index].audience = e.target.value; setFormData({...formData, batches: newB})}} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm outline-none focus:border-blue-500" /></div>
                                <div><label className="block text-xs mb-1">Days</label><input type="text" value={batch.days} onChange={(e) => {const newB = [...formData.batches]; newB[index].days = e.target.value; setFormData({...formData, batches: newB})}} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm outline-none focus:border-blue-500" /></div>
                                <div><label className="block text-xs mb-1">Time</label><input type="text" value={batch.time} onChange={(e) => {const newB = [...formData.batches]; newB[index].time = e.target.value; setFormData({...formData, batches: newB})}} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm outline-none focus:border-blue-500" /></div>
                                <div><label className="block text-xs mb-1">Seats Left</label><input type="number" value={batch.seatsLeft} onChange={(e) => {const newB = [...formData.batches]; newB[index].seatsLeft = Number(e.target.value); setFormData({...formData, batches: newB})}} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm outline-none focus:border-blue-500" /></div>
                                <div><label className="block text-xs mb-1">Mode</label><input type="text" value={batch.mode} onChange={(e) => {const newB = [...formData.batches]; newB[index].mode = e.target.value; setFormData({...formData, batches: newB})}} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm outline-none focus:border-blue-500" /></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'faqs' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">FAQs</h3>
                          <button onClick={() => setFormData({...formData, faqs: [...(formData.faqs || []), { question: '', answer: '' }]})} className="px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800">Add FAQ</button>
                        </div>
                        <div className="space-y-4">
                          {(formData.faqs || []).map((faq, index) => (
                            <div key={index} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 relative group">
                              <button onClick={() => setFormData({...formData, faqs: formData.faqs.filter((_, i) => i !== index)})} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                              <div>
                                <label className="block text-xs mb-1">Question</label>
                                <input type="text" value={faq.question} onChange={(e) => {const newF = [...formData.faqs]; newF[index].question = e.target.value; setFormData({...formData, faqs: newF})}} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm outline-none focus:border-blue-500" />
                              </div>
                              <div>
                                <label className="block text-xs mb-1">Answer</label>
                                <textarea value={faq.answer} onChange={(e) => {const newF = [...formData.faqs]; newF[index].answer = e.target.value; setFormData({...formData, faqs: newF})}} rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm outline-none focus:border-blue-500" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
`;

code = code.replace(/(\s*\{activeTab === 'mailbox' && \()/, panels + "$1");
fs.writeFileSync(file, code);
