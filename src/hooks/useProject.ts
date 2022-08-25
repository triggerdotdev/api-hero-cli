export type ProjectConfigState = { currentStatus: ProjectStatus };

type ProjectStatus = { type: "waiting" };

// export function useProjectConfig(): ProjectConfigState {
// 	const [status, setStatus] = useState<ProjectStatus[]>([{ type: "waiting" }]);

// 	useEffect(() => {
// 		async function auth() {
// 			try {
// 				const token = await loadAuthToken();
// 				if (token) {
// 					setStatus((s) => [...s, { type: "authenticated", token }]);
// 					return;
// 				}

// 				setStatus((s) => [...s, { type: "creatingRequestToken" }]);
// 				const requestToken = await api.createRequestToken();

// 				setStatus((s) => [
// 					...s,
// 					{ type: "waitingForLogin", url: `${api.authUrl}/${requestToken}` },
// 				]);
// 				const authToken = await Promise.race<AuthToken | undefined>([
// 					pollForAuthenticated(requestToken),
// 					resolveAfter(60 * 15).then(),
// 				]);

// 				if (authToken != null) {
// 					setStatus((s) => [...s, { type: "savingAuthToken" }]);
// 					await saveAuthToken(authToken);
// 					setStatus((s) => [...s, { type: "authenticated", token: authToken }]);
// 					return;
// 				}

// 				setStatus((s) => [
// 					...s,
// 					{ type: "error", error: new Error("Timeout") },
// 				]);
// 			} catch (error) {
// 				setStatus((s) => [...s, { type: "error", error }]);
// 			}
// 		}
// 		auth();
// 	}, []);

// 	return {
// 		currentStatus: status[status.length - 1]!,
// 		statuses: status,
// 	};
// }
