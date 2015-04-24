namespace AtomicNet
{

    public
    static  class   VirtualPath
    {

        [System.Obsolete("This method is not properly implemented yet.")]
        public
        static  string  GetDirectoryName(char withSeparator, string path)
        {
            #warning Replace the following call that uses String.Replace with a properly implemented solution
            return System.IO.Path.GetDirectoryName(path).Replace(System.IO.Path.DirectorySeparatorChar, withSeparator);
        }

        public
        static  string  Combine(char with, params string[] paths)
        {
            Throw<System.ArgumentNullException>.If(paths == null, "paths argument cannot be null in calls to Combine");

            int capacity        = 0;
            int rootedPathIndex = 0;
            int pathCounter     = 0;
            for (pathCounter=0; pathCounter<paths.Length; pathCounter++)
            {
                Throw<System.ArgumentNullException>.If(paths[pathCounter] == null, "paths params argument cannot contains any null values in calls to Combine");
                if (paths[pathCounter].Length != 0)
                {
                    VirtualPath.DefendAgainstInvalidCharactersInPath(paths[pathCounter]);

                    if (System.IO.Path.IsPathRooted(paths[pathCounter]))
                    {
                        rootedPathIndex = pathCounter;
                        capacity        = paths[pathCounter].Length;
                    }
                    else
                    {
                        capacity += paths[pathCounter].Length;
                    }
                    if (pathCounter<paths.Length-1 && !paths[pathCounter].EndsWithOneOf(System.IO.Path.DirectorySeparatorChar, System.IO.Path.AltDirectorySeparatorChar, System.IO.Path.VolumeSeparatorChar))   capacity++;
                }
            }

            System.Text.StringBuilder   pathBuilder = new System.Text.StringBuilder(capacity);
            for (pathCounter=rootedPathIndex; pathCounter<paths.Length; pathCounter++)
            {
                if (paths[pathCounter].Length > 0)
                {
                    if (pathBuilder.Length == 0) pathBuilder.Append(paths[pathCounter]);
                    else
                    {
                        if (!pathBuilder[pathBuilder.Length-1].IsOneOf(System.IO.Path.DirectorySeparatorChar, System.IO.Path.AltDirectorySeparatorChar, System.IO.Path.VolumeSeparatorChar))  pathBuilder.Append(with);
                        pathBuilder.Append(paths[pathCounter]);
                    }
                }
            }
            return pathBuilder.ToString();
        }

        private
        static  void    DefendAgainstInvalidCharactersInPath(string path)
        {
            Throw<System.ArgumentException>.If(path.HasAnyCharactersThatAreAnyOf((char) 0x22, (char) 60, (char) 0x3e, (char) 0x7c, (char) 0x20), "Invalid characters found in path " + path);
        }

    }

}
