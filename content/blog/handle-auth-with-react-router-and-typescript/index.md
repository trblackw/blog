---
title: Role-based authentication with react-router & TypeScript
date: 2019-12-13T00:00:00+0000
description: Defining a single, strongly typed component to handle role-based navigation 
---

[react-router-ts]: ./react-router-ts.png
![react-router-ts][react-router-ts]

Authentication is an integral part of modern day applications but has been a consistent pain point for me as a React developer and I think it's safe to say I'm not alone in this plight. 

Getting straight to it, I'm going to present the most recent setup I've been using for role-based authentication using react-router and TypeScript. That being said, this is not an intro to either of these technologies. In other words, the examples I'll provide will assume a base-level understanding of how they work.

Just a quick note before we get into code. This system is definitely not, full-stop, all you will need to effectively authenticate your production-level applications. This will not incorporate Redux or any other state management solution, nor will it address all the pieces of the puzzle. My goal is that it will serve as a base for others to build off of.

__NOTE: For simplicity, example code will use local storage for token management. I don't recommend this approach for production applications__

******

Let's say we have a inventory management tool that requires users to be authenticated and there are `super-admin`, `admin` and `non-admin` users, each of which have different write/read rights to various parts of the app.

## Typed roles

Let's set up a roles enum and then make use of it in a `userRoles` array:

```javascript
enum UserRoles {
    superAdmin = 'superAdmin',
    admin = 'admin',
    nonAdmin = 'nonAdmin'
}
//some views will be for admins only, some for users (non-admins)
// and then the rest is available for all roles
const userRoles = {
	admins: [String(UserRoles.superAdmin), String(UserRoles.admin)],
	users: [String(UserRoles.nonAdmin)],
	all: [
		String(UserRoles.superAdmin),
		String(UserRoles.admin),
		String(UserRoles.nonAdmin)
	]
};

```
You might be wondering why I convert the enum values to strings in the `userRoles` object. This is because I want to be able to check if a given user role is in an array of required roles. Using an array of type-safe strings makes this easier. Not suggesting this is best practice, but it works for me.

## Router setup

```jsx
import { 
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect 
} from 'react-router-dom';
import Login from 'views/Login';
import Dashboard from 'views/Dashboard';
import Preferences from 'views/Preferences';
import Support from 'views/Support';
import Account from 'views/Account';
import NotFound from 'views/NotFound';
import Navigation from 'components/Navigation';

const App: React.FC = (): JSX.Element => (
    <Router>
        <Navigation />
        <Switch>
            <Route exact path='/' component={Login} />
            <Route path='/dashboard' component={Dashboard} />
            <Route path='/preferences' component={Preferences} />
            <Route path='/support' component={Support} />
			<Route path='/account' component={Account} />
			<Route component={NotFound} />
        </Switch>
    </Router>
)
```
Pretty straightforward. This is a very standard navigation set up. However, right now there is no incorporation of authentication logic within our navigation, nor does the router care (or know about) a user's role as they navigate the app.

So we snap our fingers and have authentication tokens set up on the backend. Now we want to make sure that a user is logged in before viewing any of the app's content.
Let's do a couple of things to achieve this:
1) define enums for our auth & non-auth routes (this isn't necessary, but I prefer it over passing strings around)
2) define a separate component to handle the redirect logic for non-auth users accessing auth routes

```javascript
enum AuthRoutes {
	dashboard = '/dashboard',
	preferences = '/preferences',
	account = '/account'
}

enum NonAuthRoutes {
	login = '/',
	support = '/support',
	unauthorized = '/unauthorized'
}
```
## AuthRoute.tsx

Now let's create an `AuthRoute` component. We'll also add an `Unauthorized` view later that we'll show the user if they attempt to access something they're not supposed to (ideally the routing logic would prevent the user from ever seeing it, but it's a 'nice to have' just in case)


```jsx
import { RouteComponentProps } from 'react-router-dom';
...

interface Props {
	Component: React.FC<RouteComponentProps>
	path: string;
	exact?: boolean;
};

const AuthRoute = ({ Component, path, exact = false }: Props): JSX.Element => {
	const isAuthed = !!localStorage.getItem(ACCESS_TOKEN);
	const message = 'Please log in to view this page'
	return (
		<Route
			exact={exact}
			path={path}
			render={(props: RouteComponentProps) =>
				isAuthed ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: NonAuthRoutes.login,
							state: { 
								message, 
								requestedPath: path
							}
						}}
					/>
				)
			}
		/>
	);
};
```

Let's break this component down a bit. If you aren't familiar, the `Route` component from `react-router-dom` has a [render prop](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md#render-func), which allows us to pass in a function that will ultimately return a React component when the location matches the routes `path`. This is an ideal place for checking whether or not a user is authorized to view a given page in our app. This function will also have access to all of the route props that the component would have had access to if it were rendered via the standard `component` prop. After we verify a user is authenticated, we want to pass these props along to the component that's rendered.

The `Redirect` component has a [to prop](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Redirect.md#to-string) that isn't just for passing strings, you can also pass an object with properties, two of which I'm making use of in the `AuthRoute` component. `pathname` is pretty straight forward, but we can also pass pieces of state to the destination component. This can be handy if you want to allow the user to return to the view they were attempting to access before their token expired and they were unknowingly logged out.

An example of this could be seen in login logic that navigates the user to a given view after a successful login:
```javascript
const history = useHistory()
...

const login = () => {
	...
	//technically we'd need to check user role here before deciding which route
	//to coalesce to, but you get the idea
	history.push(location.state?.requestedPath ?? AuthRoutes.dashboard)
}
```

## Incorporate AuthRoute into Router

Now that we've got our `AuthRoute` component all set up, let's make use of it in our router:
```jsx
...
import Unauthorized from 'views/Unauthorized';
import { AuthRoutes, NonAuthRoutes } from 'api/routes.ts';

const App: React.FC = (): JSX.Element => (
    <Router>
        <Navigation />
        <Switch>
            <Route exact path={NonAuthRoutes.login} component={Login} />
            <AuthRoute path={AuthRoutes.dashboard} Component={Dashboard} />
            <AuthRoute path={AuthRoutes.preferences} Component={Preferences} />
            <Route path={AuthRoutes.support} component={Support} />
			<AuthRoute path={AuthRoutes.account} Component={Account} />
			<Route path={NonAuthRoutes.unauthorized} component={Unauthorized} />
			<Route component={NotFound} />
        </Switch>
    </Router>
)
```
Sweet! Now if a user attempts to access these views without being authenticated, our router will give them the boot back to the login page. Or if a user stumbles across contents they aren't allowed to view, they'll be show an `Unauthorized` view, but what about user roles? Let's assume our app is storing a `userRole` string in `Context`. Let's incorporate logic into our `AuthRoute` component to handle role checking before routing the user to a given view:

```jsx
interface Props {
	Component: React.FC<RouteComponentProps>;
	path: string;
	exact?: boolean;
	requiredRoles: string[];
}
const AuthRoute = ({ Component, path, exact = false, requiredRoles }: Props): JSX.Element => {
	const isAuthed = !!localStorage.getItem(ACCESS_TOKEN);
	const { userRole }: useContext(UserRoleContext);
	const userHasRequiredRole = requiredRoles.includes(userRole);
	const message = userHasRequiredRole ? 'Please log in to view this page' : "You can't be here!"
	return (
		<Route
			exact={exact}
			path={path}
			render={(props: RouteComponentProps) =>
				isAuthed && userHasRequiredRole ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: userHasRequiredRole ? 
							NonAuthRoutes.signin : 
							NonAuthRoutes.unauthorized,
							state: { 
								message,
								requestedPath: path 
							}
						}}
					/>
				)
			}
		/>
	);
};
```
So now, the component takes a `requiredRoles` array, which will include the roles the user must have in order to view a given page. And then now we can pass the required roles for each component:
```jsx
const App: React.FC = (): JSX.Element => (
    <Router>
        <Navigation />
        <Switch>
			<Route 
				exact path={NonAuthRoutes.login} 
				component={Login} 
			/>
			<AuthRoute 
				path={AuthRoutes.dashboard}
				Component={Dashboard} 
				requiredRoles={[
					String(UserRoles.admin),
					String(UserRoles.superAdmin)
				]} />
			<AuthRoute 
				path={AuthRoutes.preferences}
				Component={Preferences} 
				requiredRoles={[String(UserRoles.user)]}
			/>
			<Route 
				path={AuthRoutes.support} 
				component={Support} 
			/>
			<AuthRoute 
				path={AuthRoutes.account} 
				Component={Account} 
				requiredRoles={[String(UserRoles.user)]}
			/>
			<Route 
				path={NonAuthRoutes.unauthorized} 
				component={Unauthorized} 
			/>
			<Route component={NotFound} />
        </Switch>
    </Router>
)
```
 Now, not only do we want to make sure our user is authenticated, we also want to make sure that they have the rights to view whatever it is they're trying to view. Notice now that the destination for our `Redirect` component is also determined by whether or not the user has the required role.

And that's pretty much it. I've been really enjoying this set up in projects I'm working on and wanted to share it with others to see if they could make use of it (or critique it 👀). 

Thanks for listening 👋🏻