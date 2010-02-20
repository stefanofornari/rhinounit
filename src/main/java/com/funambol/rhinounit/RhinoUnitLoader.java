/*
 * Copyright Stefano Fornari 2009
 *
 * This file is part of RhinoUnit.
 *
 * RhinoUnit is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Foobar is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
 */
package com.funambol.rhinounit;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.io.IOUtils;

/**
 * This is a utility class that can be used to load RhinoUnit scripts from
 * the classpath.
 *
 * @author Stefano Fornari
 */
public class RhinoUnitLoader {

    private static final String[] SCRIPTS = new String[]{
        "/js/jsUnitCore.js",
        "/js/xbDebug.js",
        "/js/jsUnitResult.js",
        "/js/jsUnitResultWriter.js",
        "/js/jsUnitTestManager.js",
        "/js/jsUnitTestSuite.js",
        "/js/jsUnitTracer.js"
    };

    public RhinoUnitLoader() {
    }

    /**
     * Returns a script containing the entire RhinoUnit framework.
     * Single RhinoUnit scripts are loaded from the classpath so that the
     * framework can be easily used simply adding the jar in the classpath
     *
     * @return the RhinoUnit framework in a single script
     *
     * @throws IOException if the framework could not be loaded from classpath
     */
    public String getRhinoUnit() throws IOException {
        StringBuffer ret = new StringBuffer();

        InputStream is = null;
        for (int i=0; i<SCRIPTS.length; ++i) {
            try {
                is = getClass().getResourceAsStream(SCRIPTS[i]);
                if (is == null) {
                    throw new FileNotFoundException("Resource " + SCRIPTS[i] + " not found in classpath");
                }
                
                ret.append(IOUtils.toString(is)).append("\n\n");
            } finally {
                if (is != null) {
                    is.close();
                }
            }
        }

        return ret.toString();
    }
}
