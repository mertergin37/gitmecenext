import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // Parameters
        const name = searchParams.get('name') || 'Destinasyon';
        const score = searchParams.get('score') || '0';
        const verdict = searchParams.get('verdict') || 'sinirda';
        const scoreNum = parseInt(score);

        // Theme colors based on verdict
        let primaryColor = '#ffffff';
        let accentColor = '#10b981'; // emerald-500
        let verdictText = 'GİT';

        if (verdict === 'gitme') {
            accentColor = '#ef4444'; // red-500
            verdictText = 'GİTME';
        } else if (verdict === 'sinirda') {
            accentColor = '#f59e0b'; // amber-500
            verdictText = 'SINIRDA';
        }

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#000000',
                        backgroundImage: 'radial-gradient(circle at 50% 50%, #111111 0%, #000000 100%)',
                        fontFamily: 'sans-serif',
                        padding: '80px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Ambient Glows */}
                    <div style={{
                        position: 'absolute',
                        top: '-20%',
                        right: '-20%',
                        width: '800px',
                        height: '800px',
                        borderRadius: '100%',
                        background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`,
                        filter: 'blur(100px)',
                    }} />

                    {/* Logo Section */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '60px',
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: accentColor,
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                        </div>
                        <span style={{ fontSize: '32px', fontWeight: '900', color: '#fff', letterSpacing: '-0.05em' }}>GİTMECE</span>
                    </div>

                    {/* Main Card */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '40px',
                        padding: '60px',
                        width: '100%',
                        textAlign: 'center',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                            ANALİZ SONUCU
                        </span>
                        <h1 style={{ fontSize: '80px', fontWeight: '900', color: '#fff', marginTop: '20px', marginBottom: '10px', letterSpacing: '-0.02em' }}>
                            {name}
                        </h1>

                        {/* Score Circle */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            width: '260px',
                            height: '260px',
                            marginTop: '40px',
                        }}>
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                borderRadius: '100%',
                                border: `8px solid rgba(255, 255, 255, 0.05)`,
                            }} />
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                borderRadius: '100%',
                                border: `8px solid ${accentColor}`,
                                opacity: 1,
                            }} />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span style={{ fontSize: '100px', fontWeight: '900', color: primaryColor }}>{score}</span>
                                <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.5)', marginTop: '-10px' }}>UYUM %</span>
                            </div>
                        </div>

                        {/* Verdict Badge */}
                        <div style={{
                            marginTop: '60px',
                            background: accentColor,
                            color: '#000',
                            padding: '16px 40px',
                            borderRadius: '20px',
                            fontSize: '32px',
                            fontWeight: '900',
                            letterSpacing: '0.1em',
                        }}>
                            {verdictText}
                        </div>
                    </div>

                    {/* Footer */}
                    <p style={{
                        marginTop: '60px',
                        fontSize: '20px',
                        color: 'rgba(255, 255, 255, 0.3)',
                        maxWidth: '80%',
                        textAlign: 'center',
                        lineHeight: '1.5',
                    }}>
                        Gitmece algoritması tarafından analiz edilmiştir. Senin rotan neresi?
                    </p>
                    <div style={{ marginTop: '20px', fontSize: '24px', fontWeight: 'bold', color: accentColor }}>gitmece.com</div>
                </div>
            ),
            {
                width: 1080,
                height: 1920,
            }
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
