# Branchement Supabase (à faire plus tard)

Chaque fichier `mock/*.service.ts` implémente une interface définie dans `interfaces/`.
Pour brancher Supabase :

1. Créer un client Supabase dans `supabase/client.ts` (`createClient(url, anonKey)`).
2. Pour chaque service, créer `supabase/<nom>.service.ts` qui implémente la même
   interface (`IProductsService`, `ICustomersService`, etc.) mais avec des appels
   `supabase.from('products').select(...).eq('shop_id', shop_id)` à la place du
   tableau en mémoire.
3. Activer Row Level Security (RLS) sur chaque table avec une policy du type :
   ```sql
   create policy "shop isolation" on products
     for all using (shop_id = auth.jwt() ->> 'shop_id');
   ```
4. Dans `services/client.ts`, remplacer les imports `./mock/*` par `./supabase/*`.
   Aucun composant, hook ou store n'a besoin d'être modifié puisqu'ils ne
   connaissent que les interfaces, jamais l'implémentation concrète.
5. Remplacer `authService` (mock, basé sur un code boutique en sessionStorage)
   par un vrai flux Supabase Auth, en stockant `shop_id` dans les user metadata
   ou une table `shop_owners` liée à `auth.users.id`.
6. `shopsService` (création de boutiques par le superadmin) doit devenir une
   route/fonction protégée côté serveur (Supabase Edge Function ou policy RLS
   réservée à un rôle `platform_admin`), jamais un accès direct côté client —
   contrairement aux autres services, la création de boutique ne doit pas être
   soumise aux mêmes règles RLS `shop_id = ...` puisqu'elle opère avant qu'un
   `shop_id` n'existe.
