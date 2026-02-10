const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

export interface UnsplashImage {
    url: string;
    description: string;
    photographer: {
        name: string;
        link: string;
    };
}

export const UnsplashService = {
    async searchDestinationImage(query: string): Promise<UnsplashImage | null> {
        if (!UNSPLASH_ACCESS_KEY) {
            console.warn('Unsplash API Key is missing. Falling back to default visuals.');
            return null;
        }

        try {
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + ' travel landscape')}&orientation=landscape&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
            );

            if (!response.ok) {
                console.error('Unsplash API Error:', response.statusText);
                return null;
            }

            const data = await response.json();
            const photo = data.results[0];

            if (!photo) return null;

            return {
                url: photo.urls.regular,
                description: photo.alt_description || query,
                photographer: {
                    name: photo.user.name,
                    link: photo.user.links.html
                }
            };
        } catch (error) {
            console.error('Unsplash Service Failed:', error);
            return null;
        }
    }
};
